import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';
import type { Browser } from 'playwright-core';

import { launch, layout, requiredEnv, settle, VIEWPORTS, visit } from './harness.ts';

describe('自定义文件名辨识规则', () => {
  let browser: Browser;
  before(async () => { browser = await launch() });
  after(async () => { await browser?.close() });
  for (const viewport of VIEWPORTS) {
    it(`${viewport.name}: 预览、保存与停用规则`, async () => {
      const origin = requiredEnv('PEACH_E2E_ORIGIN');
      const opened = await visit(browser, '/settings/library', viewport, async page => {
        const reset = await page.request.post(`${origin}/api/filename-rules`, {
          data: { items: [] }, headers: { Origin: origin },
        });
        assert.equal(reset.status(), 200);
      });
      try {
        const { page } = opened;
        const form = page.getByRole('form', { name: '文件名辨识规则' });
        await form.getByRole('button', { name: '新增规则', exact: true }).click();
        await form.getByLabel('规则 1 正则表达式', { exact: true }).fill(String.raw`自訂_(?P<id>[0-9]+)`);
        await form.getByLabel('测试文件名', { exact: true }).fill('自訂_1234567 測試.mp4');
        await form.getByLabel('测试文件名', { exact: true }).press('Enter');
        await form.getByText('匹配规则：FC2 番号', { exact: true }).waitFor();
        assert.ok((await form.textContent())?.includes('FC2-PPV-1234567'));
        const save = async () => {
          await Promise.all([
            page.waitForResponse(response => response.url().endsWith('/api/filename-rules')
              && response.request().method() === 'POST' && response.request().postDataJSON().action !== 'preview'),
            form.getByRole('button', { name: '保存配置', exact: true }).click(),
          ]);
          await settle(page);
        };
        await save();
        await page.reload({ waitUntil: 'load' });
        await form.getByLabel('规则 1 正则表达式', { exact: true }).waitFor();
        assert.equal(await form.getByLabel('规则 1 正则表达式', { exact: true }).inputValue(), String.raw`自訂_(?P<id>[0-9]+)`);
        const box = await layout(page);
        assert.ok(box.scrollWidth <= box.viewportWidth, JSON.stringify(box));
        assert.deepEqual(box.offenders, []);
        const screenshots = process.env.PEACH_FILENAME_RULES_SCREENSHOTS;
        if (screenshots) {
          mkdirSync(screenshots, { recursive: true });
          await form.scrollIntoViewIfNeeded();
          await page.screenshot({ path: join(screenshots, `${viewport.name}.png`), fullPage: true });
        }
        const toggle = page.getByRole('switch', { name: '启用规则 1', exact: true });
        await page.locator('label').filter({ has: toggle }).click();
        assert.equal(await toggle.isChecked(), false);
        await save();
        await form.getByLabel('测试文件名', { exact: true }).fill('自訂_1234567 測試.mp4');
        await form.getByLabel('测试文件名', { exact: true }).press('Enter');
        await form.getByText('未识别到番号', { exact: true }).waitFor();
        assert.deepEqual(opened.problems, []);
      } finally {
        await opened.page.request.post(`${origin}/api/filename-rules`, { data: { items: [] }, headers: { Origin: origin } });
        await opened.close();
      }
    });
  }
});
