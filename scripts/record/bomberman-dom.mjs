// bomberman-dom: four players through the lobby into a live match. The page
// being recorded is one player; the other three are real clients in the same
// browser, so the lobby fills and the countdown starts the way it does for
// people.
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { REPOS, click, record, serve, sleep, stills, type } from './lib.mjs';

const ID = 'bomberman-dom';
// The finished game lives on the Client-Render branch; `main` is an earlier
// client. Clone that branch into REPOS as `bomberman-render`.
const REPO = path.join(REPOS, 'bomberman-render');
const CLIENT_PORT = 5374;
const WS_PORT = 8091;
const URL = `http://localhost:${CLIENT_PORT}/`;

// The client reads the socket port from a constant fixed at 8080. That port is
// often taken on a dev machine, so the recording serves the same file with the
// port swapped rather than editing the repo.
async function usePort(context) {
  const src = await readFile(path.join(REPO, 'shared/constants.js'), 'utf8');
  await context.route('**/shared/constants.js', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: src.replace('WS_PORT: 8080', `WS_PORT: ${WS_PORT}`) })
  );
}

// Title screen, then a name (3 to 8 characters) and a colour.
async function join(page, name, color, pace = false) {
  await page.goto(URL);
  await page.locator('button').first().waitFor();
  if (pace) {
    await sleep(1200);
    await click(page, page.locator('button').first(), { pause: 700 });
    await click(page, '#username');
    await type(page, name);
    await click(page, `#${color}`, { pause: 500 });
    await click(page, '#submit', { pause: 600 });
  } else {
    await page.locator('button').first().click();
    await page.locator('#username').fill(name);
    await page.locator(`#${color}`).click();
    await page.locator('#submit').click();
  }
}

const hold = async (page, key, ms) => {
  await page.keyboard.down(key);
  await sleep(ms);
  await page.keyboard.up(key);
  await sleep(90);
};

// One tile takes a third of a second at base speed; a little over keeps the
// player from stopping short of the tile centre.
const STEP = 380;

// Lay a bomb one tile along `out`, step back and round the corner out of the
// blast, wait for it, and come back.
async function bombRun(page, [out, back, side, sideBack]) {
  await hold(page, out, STEP);
  await page.keyboard.press('Space');
  await sleep(120);
  await hold(page, back, STEP);
  await hold(page, side, STEP);
  await sleep(2700);
  await hold(page, sideBack, STEP);
}

const OTHERS = [
  ['noor', 'green'],
  ['sami', 'red'],
  ['rex', 'white'],
];

async function fillRoom(context, viewport) {
  const pages = [];
  for (const [name, color] of OTHERS) {
    const p = await context.newPage();
    if (viewport) await p.setViewportSize(viewport);
    await join(p, name, color);
    pages.push(p);
  }
  return pages;
}

const stopWs = await serve('node', ['server/index.js'], { cwd: REPO, env: { PORT: String(WS_PORT) }, url: `http://localhost:${WS_PORT}/` });
const stopClient = await serve('node', ['scripts/serve-client.mjs'], { cwd: REPO, env: { CLIENT_PORT: String(CLIENT_PORT) }, url: URL });

const GAME_VIEW = { width: 1000, height: 700 };
const board = (page) => page.locator('#gameElement').boundingBox();

try {
  // The video is the match itself, cropped to the board and its HUD: nearly
  // square, so it fills a phone's width instead of sharing it with the
  // instructions panel. The title, character select and lobby are stills.
  await record(
    ID,
    async (page, { context, take }) => {
      await usePort(context);
      await join(page, 'asmawi', 'blue');
      const [green] = await fillRoom(context, GAME_VIEW);
      await page.bringToFront();
      await page.locator('#gameElement').waitFor({ timeout: 60000 });
      await sleep(600);
      take.crop(await board(page));
      take.from();
      await sleep(900);
      // Two players open up their corners at once.
      await Promise.all([
        bombRun(page, ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp']),
        bombRun(green, ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp']),
      ]);
      await Promise.all([
        bombRun(page, ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft']),
        bombRun(green, ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']),
      ]);
      await sleep(1200);
    },
    { viewport: GAME_VIEW, cursor: false }
  );

  await stills(ID, async (open) => {
    const { page, shot, context } = await open('desktop');
    await usePort(context);
    await page.goto(URL);
    await page.locator('button').first().waitFor();
    await sleep(500);
    await shot('title');
    await page.locator('button').first().click();
    await page.locator('#username').fill('asmawi');
    await page.locator('#blue').click();
    await sleep(300);
    await shot('character-select');
    await page.locator('#submit').click();
    await fillRoom(context);
    await page.bringToFront();
    await sleep(1200);
    await shot('lobby');
    await page.locator('#gameElement').waitFor({ timeout: 60000 });
    await sleep(900);
    await shot('match');
    await hold(page, 'ArrowRight', STEP);
    await page.keyboard.press('Space');
    await hold(page, 'ArrowLeft', STEP);
    await hold(page, 'ArrowDown', STEP);
    await sleep(1750);
    await shot('explosion');
  });
} finally {
  stopWs();
  stopClient();
}
