import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';
import type { Browser } from 'playwright-core';
import { launch, layout, settle, VIEWPORTS, visit } from './harness.ts';

describe('逐项复核文件', () => {
  let browser: Browser;
  before(async () => { browser = await launch() });
  after(async () => { await browser?.close() });
  for (const viewport of VIEWPORTS) {
    it(`${viewport.name}: 勾选、取消、回收与整组保留`, async () => {
      const batches: number[][] = [];
      let kept = false;
      const files = [1, 2, 3].map(id => ({ id, name: `FC2-PPV-1234567_${id}${id === 3 ? ' 特典及字幕版本' : ''}.mp4`,
        path: `Y:\\影片\\FC2-PPV-1234567\\字幕与特典版本\\${id}.mp4`, location: 'local', drive: 'Y:',
        size: id === 3 ? 100_000_000 : 4_000_000_000, duration: id === 3 ? 180 : 7200,
        is_largest: id === 1, is_longest: id === 1 }));
      const opened = await visit(browser, '/duplicates', viewport, async page => {
        await page.route('**/api/duplicates?**', route => {
          const url = new URL(route.request().url());
          const versions = url.searchParams.get('mode') === 'versions';
          const show = versions || (url.searchParams.get('kept') === 'true') === kept;
          const selected = versions ? files : files.slice(0, 2);
          return route.fulfill({ json: { total: show ? 1 : 0, files: show ? selected.length : 0, reclaimable: versions ? 0 : 4_000_000_000,
            kept_total: kept ? 1 : 0, pending_files: 3, pending_bytes: 8_100_000_000,
            groups: show ? [{ key: versions ? 'versions' : 'exact', code: 'FC2-PPV-1234567', count: selected.length,
              identical: !versions, kept, drives: ['Y:'], cross_drive: false, reclaimable: 4_000_000_000, files: selected }] : [] } });
        });
        await page.route('**/api/duplicates/keep', async route => {
          kept = route.request().postDataJSON().keep;
          await route.fulfill({ json: { ok: true } });
        });
        await page.route('**/api/batch', async route => {
          batches.push(route.request().postDataJSON().ids);
          await route.fulfill({ json: { ok: true, changed: 1 } });
        });
        await page.route('**/thumb?**', route => route.fulfill({ contentType: 'image/png',
          body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9foAAAAASUVORK5CYII=', 'base64') }));
      });
      try {
        const { page } = opened;
        const one = page.getByRole('checkbox', { name: '回收 FC2-PPV-1234567_1.mp4', exact: true });
        const two = page.getByRole('checkbox', { name: '回收 FC2-PPV-1234567_2.mp4', exact: true });
        await one.waitFor();
        assert.equal(await one.isChecked(), false);
        assert.equal(await two.isChecked(), false);
        assert.equal(await page.getByRole('button', { name: '整组回收', exact: true }).count(), 0);
        await page.locator('label').filter({ has: two }).click();
        assert.equal(await two.isChecked(), true);
        assert.equal(await one.isChecked(), false);
        const recycle = page.getByRole('button', { name: '将选中的 1 项移入回收站', exact: true });
        await recycle.click();
        const dialog = page.getByRole('dialog');
        await dialog.waitFor();
        assert.ok((await dialog.textContent())?.includes('其余 1 个文件保留'));
        await dialog.getByRole('button', { name: '取消', exact: true }).click();
        assert.deepEqual(batches, []);
        await recycle.click();
        await dialog.getByRole('button', { name: '移入回收站', exact: true }).click();
        await page.getByRole('button', { name: '将选中的 0 项移入回收站', exact: true }).waitFor();
        assert.deepEqual(batches, [[2]]);
        await page.getByRole('button', { name: '整组保留', exact: true }).click();
        await page.getByRole('button', { name: '已整组保留 1 组', exact: true }).click();
        await page.getByRole('button', { name: '取消整组保留', exact: true }).click();
        await page.getByRole('button', { name: '同番号版本', exact: true }).click();
        await page.getByRole('checkbox', { name: '回收 FC2-PPV-1234567_3 特典及字幕版本.mp4', exact: true }).waitFor();
        assert.ok((await page.locator('#stats').textContent())?.includes('内容未确认相同'));
        assert.equal(await one.isChecked(), false);
        const geometry = await layout(page);
        assert.ok(geometry.scrollWidth <= geometry.viewportWidth, JSON.stringify(geometry));
        assert.deepEqual(geometry.offenders, []);
        const screenshots = process.env.PEACH_DUPLICATES_SCREENSHOTS;
        if (screenshots) {
          mkdirSync(screenshots, { recursive: true }); await settle(page);
          await page.screenshot({ path: join(screenshots, `${viewport.name}.png`), fullPage: true });
        }
        assert.deepEqual(opened.problems, []);
      } finally { await opened.close(); }
    });
  }
});
