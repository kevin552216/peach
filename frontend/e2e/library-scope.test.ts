import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import type { Browser } from 'playwright-core';
import { launch, settle, visit, VIEWPORTS } from './harness.ts';

describe('媒体库目录范围', () => {
  let browser: Browser;
  before(async () => { browser = await launch() });
  after(async () => { await browser?.close() });

  for (const viewport of VIEWPORTS) {
    it(`${viewport.name}：切换媒体库和返回全部时目录与筛选使用同一范围`, async () => {
      const requests: string[] = [];
      const opened = await visit(browser, '/', viewport, async page => {
        await page.route('**/api/libraries', route => route.fulfill({ json: {
          libraries: [{ id: 'first', name: '媒体库甲' }, { id: 'second', name: '媒体库乙' }],
        } }));
        // 导航提交后只记录新文档的请求，避免把旧页离开前的异步查询算入新媒体库。
        page.on('framenavigated', frame => {
          if (frame === page.mainFrame()) requests.length = 0;
        });
        page.on('request', request => {
          if (/^\/api\/(items|facets)$/.test(new URL(request.url()).pathname)) requests.push(request.url());
        });
      });
      const { page } = opened;
      try {
        for (const [library, label] of [['first', '媒体库甲'], ['second', '媒体库乙'], ['', '全部媒体库']]) {
          if (viewport.mobile && !await page.locator('#drawer').evaluate(node => node.classList.contains('open'))) {
            await page.locator('#filterBtn').click();
          }
          await page.locator('#brandHome').click();
          const choice = page.locator('#boardLibraryMenu').getByRole('button', { name: label, exact: true });
          await choice.waitFor({ state: 'visible' });
          await Promise.all([page.waitForEvent('load'), choice.click()]);
          await page.locator('#brandHome h1').filter({ hasText: label }).waitFor();
          await page.waitForFunction(() => document.querySelector('#main [aria-busy="true"]') === null);
          await settle(page);
          const current = requests.map(url => new URL(url));
          assert.ok(current.some(url => url.pathname === '/api/items'));
          assert.ok(current.some(url => url.pathname === '/api/facets'));
          assert.ok(current.every(url => (url.searchParams.get('library') || '') === library), requests.join('\n'));
        }
        assert.deepEqual(opened.problems, []);
      } finally { await opened.close() }
    });
  }
});
