import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import type { Browser } from 'playwright-core';
import { launch, layout, visit, VIEWPORTS } from './harness.ts';

describe('资料来源顺序与请求身分', () => {
  let browser: Browser;
  before(async () => { browser = await launch() });
  after(async () => { await browser.close() });
  for (const viewport of [VIEWPORTS.find(one => !one.mobile)!, VIEWPORTS.find(one => one.mobile)!]) {
    it(`${viewport.mobile ? '手机' : '桌面'}排序后保存下一次采集的偏好`, { timeout: 60_000 }, async () => {
      const opened = await visit(browser, '/sources', viewport);
      try {
        const page = opened.page;
        const sent: Record<string, unknown>[] = [];
        await page.route('**/api/metadata-preferences', route => {
          const body = route.request().method() === 'POST' ? route.request().postDataJSON() : null;
          if (body) sent.push(body);
          return route.fulfill({ json: { user_agent: body?.user_agent || 'Chrome', default_user_agent: 'Chrome',
            routes: body?.routes || {}, types: [{ id: 'fc2', sources: [
              { id: 'fc2', label: 'FC2' }, { id: 'fc2cmadb', label: 'FC2CMADB' },
            ] }] } });
        });
        await page.reload();
        const region = page.getByRole('region', { name: '资料来源顺序', exact: true });
        const mirror = region.locator('[data-source-order="fc2cmadb"]');
        await mirror.focus();
        await mirror.press('Alt+ArrowUp');
        assert.equal(await region.locator('[data-source-order]').first().getAttribute('data-source-order'), 'fc2cmadb');
        assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-source-order')), 'fc2cmadb');
        await region.getByRole('textbox', { name: 'HTTP User-Agent', exact: true }).fill('Test Browser/1');
        await region.getByRole('button', { name: '保存来源设置', exact: true }).click();
        await page.getByText('已保存资料来源顺序', { exact: true }).waitFor();
        assert.equal(sent[0]!.user_agent, 'Test Browser/1');
        assert.deepEqual(sent[0]!.routes, { fc2: ['fc2cmadb', 'fc2'] });
        assert.deepEqual((await layout(page)).offenders, []);
      } finally { await opened.close() }
    });
  }
});
