// mini-framework: its TodoMVC example, which is the framework's whole surface
// in one screen — virtual DOM diffing, keyed lists, the store and hash routing.
import path from 'node:path';
import { REPOS, click, record, serve, sleep, stills, type } from './lib.mjs';

const ID = 'mini-framework';
// The repo's own server is fixed to 5173, which is also Vite's port; the README
// offers a plain static server as the alternative, on any port.
const PORT = 5273;
const URL = `http://localhost:${PORT}/examples/todomvc/`;
const TODOS = ['Diff the virtual DOM', 'Patch only what changed', 'Route on the hash', 'Ship without a build step'];

const stop = await serve('python3', ['-m', 'http.server', String(PORT)], { cwd: path.join(REPOS, ID), url: URL });

async function fill(page, todos, pace = true) {
  await page.locator('.new-todo').click();
  for (const t of todos) {
    if (pace) await type(page, t);
    else await page.keyboard.type(t);
    await page.keyboard.press('Enter');
    if (pace) await sleep(350);
  }
}

try {
  await record(ID, async (page) => {
    await page.goto(URL);
    await sleep(900);
    await click(page, '.new-todo');
    await fill(page, TODOS);
    await click(page, page.locator('.todo-list li .toggle').nth(0));
    await click(page, page.locator('.todo-list li .toggle').nth(1), { pause: 700 });
    await click(page, 'a[href="#/active"]', { pause: 1100 });
    await click(page, 'a[href="#/completed"]', { pause: 1100 });
    await click(page, 'a[href="#/"]', { pause: 700 });
    // Edit in place: double-click a title, retype it, commit with Enter.
    const label = page.locator('.todo-list li label').nth(2);
    const box = await label.boundingBox();
    await page.mouse.move(box.x + 60, box.y + box.height / 2, { steps: 14 });
    await page.mouse.dblclick(box.x + 60, box.y + box.height / 2);
    await sleep(400);
    await page.keyboard.press('ControlOrMeta+a');
    await type(page, 'Route on the URL hash');
    await page.keyboard.press('Enter');
    await sleep(700);
    await click(page, '.clear-completed', { pause: 1400 });
  });

  await stills(ID, async (open) => {
    const desk = await open('desktop');
    await desk.page.goto(URL);
    await fill(desk.page, TODOS, false);
    await desk.page.locator('.todo-list li .toggle').nth(0).click();
    await desk.page.locator('.todo-list li .toggle').nth(1).click();
    await desk.page.mouse.move(10, 10);
    await desk.shot('all');
    await desk.page.locator('a[href="#/active"]').click();
    await desk.shot('active-filter');
    await desk.page.locator('a[href="#/"]').click();
    await desk.page.locator('.todo-list li label').nth(2).dblclick();
    await desk.shot('editing');

    const phone = await open('phone');
    await phone.page.goto(URL);
    await fill(phone.page, TODOS, false);
    await phone.page.locator('.todo-list li .toggle').nth(0).click();
    await phone.shot('phone');
  });
} finally {
  stop();
}
