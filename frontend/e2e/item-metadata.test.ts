import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import type { Browser } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import { launch, layout, VIEWPORTS } from './harness.ts';
import { ITEM, openItemPage } from './item-fixture.ts';

describe('单档资料重新取得', () => {
  let browser: Browser;
  before(async () => { browser = await launch() });
  after(async () => { await browser.close() });
  for (const viewport of [VIEWPORTS.find(one => !one.mobile)!, VIEWPORTS.find(one => one.mobile)!]) {
    it(`${viewport.mobile ? '手机' : '桌面'}选择多家来源、采用演员并保留保护标记`, { timeout: 60_000 }, async () => {
      const opened = await openItemPage(browser, `/assets/${ITEM.seller}`, viewport, { ready: '#stage[open] [data-item-side]' });
      try {
        const page = opened.page;
        const sent: Record<string, unknown>[] = [];
        const state = { id: ITEM.seller, code: 'FC2-PPV-4075681', snapshot_id: 'evidence', revision: 1, busy: false,
          sources: [{ id: 'fc2cmadb', label: 'FC2CMADB' }, { id: 'fc2ppvdb', label: 'FC2PPV-DB' },
            { id: 'javdb', label: 'javdb' }], protected: [] as unknown[], issues: [],
          job: { status: 'complete' }, groups: [] as unknown[] };
        await page.route('**/api/item-metadata*', route => {
          if (route.request().method() === 'POST') {
            const body = route.request().postDataJSON();
            sent.push(body);
            if (body.action === 'fetch') state.groups = [{ field: 'performers', label: '出演者', current: '', candidates: [
              { candidate_key: 'cast', source: 'fc2cmadb', display_value: '来源艺名', source_url: 'https://example.test/articles/4075681' },
              { candidate_key: 'other-cast', source: 'fc2ppvdb', display_value: '另一来源艺名' },
            ] }];
            if (body.action === 'apply') state.protected = [{ field: 'performers', label: '出演者', source: 'fc2cmadb' }];
          }
          return route.fulfill({ json: state });
        });
        await page.getByRole('button', { name: '重新抓取资料', exact: true }).click();
        await page.getByText('FC2CMADB', { exact: true }).click();
        assert.equal(await page.getByRole('checkbox', { name: 'FC2CMADB', exact: true }).isChecked(), true);
        await page.getByRole('checkbox', { name: 'FC2PPV-DB', exact: true }).focus();
        await page.keyboard.press('Space');
        assert.equal(await page.getByRole('checkbox', { name: 'FC2PPV-DB', exact: true }).isChecked(), true);
        assert.equal(await page.getByRole('checkbox', { name: 'javdb', exact: true }).isChecked(), false);
        const priority = page.getByRole('group', { name: '优先查询的资料', exact: true });
        for (const name of ['标题', '发行日期', '标签']) await priority.getByText(name, { exact: true }).click();
        await page.getByRole('button', { name: '查询最新资料', exact: true }).click();
        const cast = page.getByRole('button', { name: '采用的出演者', exact: true });
        await cast.scrollIntoViewIfNeeded();
        await cast.click();
        await page.getByRole('option', { name: 'FC2CMADB：来源艺名', exact: true }).click();
        await page.getByRole('button', { name: '采用所选资料并保护', exact: true }).click();
        await page.getByText('出演者已保护 · FC2CMADB', { exact: true }).waitFor();
        assert.deepEqual(sent.map(body => body.action), ['fetch', 'apply']);
        assert.deepEqual(sent[0]!.sources, ['fc2cmadb', 'fc2ppvdb']);
        assert.deepEqual(sent[0]!.metadata_fields, ['performers', 'studio']);
        assert.equal(sent[0]!.fill_other_metadata, true);
        assert.deepEqual(sent[1]!.choices, { performers: 'cast' });
        assert.deepEqual((await layout(page)).offenders, []);
        await page.screenshot({ path: fileURLToPath(new URL(`../../build/agent-verification/item-metadata-${viewport.mobile ? 'mobile' : 'desktop'}.png`, import.meta.url)) });
      } finally { await opened.close() }
    });
  }
});
