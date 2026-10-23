import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';
import type { Browser } from 'playwright-core';
import { launch, layout, requiredEnv, settle, VIEWPORTS, visit } from './harness.ts';

describe('可调整的新任务', () => {
  let browser: Browser;
  before(async () => { browser = await launch() });
  after(async () => { await browser?.close() });
  for (const viewport of VIEWPORTS) {
    it(`${viewport.name}: 停止后选资料任务，再派低占用就绪预览`, async () => {
      let state: Record<string, unknown> = { status: 'paused', job_id: 'old', checked: 5, total: 100, speed_mode: 'high' };
      const writes: Record<string, unknown>[] = [];
      const opened = await visit(browser, '/data-cleanup', viewport, async page => {
        await page.route('**/api/library-processing', async route => {
          if (route.request().method() === 'POST') {
            const body = route.request().postDataJSON();
            writes.push(body);
            state = body.action === 'stop' ? { ...state, status: 'cancelled' }
              : { ...state, status: 'running', job_id: `new-${writes.length}`, requested_tasks: body.tasks,
                execution_mode: body.execution_mode, speed_mode: body.speed_mode,
                work_progress: Object.fromEntries(body.tasks.map((task: string) => [task,
                  { status: 'running', done: 2, total: 100, failed: 0, deferred: 0 }])) };
          }
          await route.fulfill({ json: state });
        });
      });
      try {
        const { page } = opened;
        const card = page.getByRole('region', { name: '扫描与采集', exact: true });
        const stop = async () => {
          await card.getByRole('button', { name: '停止任务', exact: true }).click();
          await page.getByRole('dialog', { name: '停止扫描与采集', exact: true })
            .getByRole('button', { name: '停止任务', exact: true }).click();
          await card.getByRole('button', { name: '同步媒体库', exact: true }).waitFor({ state: 'visible' });
          await page.getByText('已停止扫描与采集', { exact: true }).waitFor();
        };
        await stop();
        await card.getByRole('button', { name: '同步媒体库', exact: true }).click();
        const dialog = page.getByRole('dialog', { name: '新任务', exact: true });
        await dialog.waitFor();
        assert.equal(await dialog.getByRole('checkbox', { name: '生成视频预览', exact: true }).isChecked(), false);
        assert.equal(await dialog.getByRole('checkbox', { name: '补齐封面', exact: true }).isChecked(), false);
        await dialog.getByText('更新文件清单', { exact: true }).click();
        assert.equal(await dialog.getByRole('checkbox', { name: '更新文件清单', exact: true }).isChecked(), false);
        await dialog.getByRole('button', { name: '开始任务', exact: true }).click();
        await card.getByRole('list', { name: '各项工作进度', exact: true }).waitFor();
        assert.deepEqual(writes[1]?.tasks, ['probe', 'metadata']);
        assert.equal(writes[1]?.execution_mode, 'sequential');
        await stop();
        await card.getByRole('button', { name: '更多同步方式', exact: true }).click();
        await page.getByRole('dialog', { name: '同步方式', exact: true })
          .getByRole('button', { name: '仅生成视频预览', exact: true }).click();
        await dialog.waitFor();
        assert.equal(await dialog.getByRole('radio', { name: '低占用', exact: true }).isChecked(), true);
        await dialog.getByRole('radio', { name: '就绪即处理', exact: true }).check();
        await dialog.getByText('只补缺失项目，已有结果保留。更新清单后，逐档衔接属性与预览、资料与封面，不必等待整批前置工作。', { exact: true }).waitFor();
        await dialog.getByText('暂缓疑似重复项的预览', { exact: true }).click();
        assert.equal(await dialog.getByRole('checkbox', { name: '暂缓疑似重复项的预览', exact: true }).isChecked(), false);
        const box = await layout(page);
        assert.ok(box.scrollWidth <= box.viewportWidth, JSON.stringify(box));
        assert.deepEqual(box.offenders, []);
        const screenshots = process.env.PEACH_TASK_SCREENSHOTS;
        if (screenshots) {
          mkdirSync(screenshots, { recursive: true });
          await page.screenshot({ path: join(screenshots, `${viewport.name}-new-task.png`), fullPage: true });
        }
        await dialog.getByRole('button', { name: '开始任务', exact: true }).click();
        assert.deepEqual(writes[3]?.tasks, ['previews']);
        assert.equal(writes[3]?.speed_mode, 'low');
        assert.equal(writes[3]?.execution_mode, 'pipeline');
        assert.equal(writes[3]?.defer_suspected_duplicates, false);
        await stop();
        await settle(page);
        assert.deepEqual(opened.problems, []);
      } finally { await opened.close() }
    });
  }
  it('真实接口接受独立属性任务且不生成图片', async () => {
    const opened = await visit(browser, '/data-cleanup', VIEWPORTS[0]);
    try {
      const origin = requiredEnv('PEACH_E2E_ORIGIN');
      const response = await opened.page.request.post(`${origin}/api/library-processing`, {
        headers: { Origin: origin }, data: { stage: 'probe', tasks: ['probe'],
          asset_ids: [Number(requiredEnv('PEACH_E2E_ITEM'))], execution_mode: 'pipeline', speed_mode: 'low' },
      });
      assert.equal(response.status(), 200);
      let state = await response.json();
      const deadline = Date.now() + 60_000;
      while (['running', 'pausing', 'paused', 'stopping'].includes(state.status) && Date.now() < deadline) {
        await opened.page.waitForTimeout(100);
        state = await (await opened.page.request.get(`${origin}/api/library-processing`)).json();
      }
      assert.equal(state.status, 'complete', JSON.stringify(state));
      assert.deepEqual(state.requested_tasks, ['probe']);
      assert.equal(state.execution_mode, 'pipeline');
      assert.equal(state.previews || 0, 0);
      assert.equal(state.covers || 0, 0);
    } finally { await opened.close() }
  });
});
