import { test, expect } from '@playwright/test';

// Sample content: left = fold / interval / common-ground, right = notations / afterimage / blue-hours.
const leftPanel = (page) => page.locator('[data-panel="left"]');
const rightPanel = (page) => page.locator('[data-panel="right"]');
const leftFeed = (page) => page.locator('[data-group="left"] .feed');
const rightFeed = (page) => page.locator('[data-group="right"] .feed');

test.describe('desktop', () => {
  test.use({ viewport: { width: 1280, height: 560 } });

  test('the two columns scroll independently', async ({ page }) => {
    await page.goto('/');
    for (const feed of [leftFeed(page), rightFeed(page)]) {
      const scrollable = await feed.evaluate((el) => el.scrollHeight > el.clientHeight);
      expect(scrollable, 'each column needs its own scrollbar').toBe(true);
    }
    await leftFeed(page).evaluate((el) => { el.scrollTop = 200; });
    expect(await leftFeed(page).evaluate((el) => el.scrollTop)).toBe(200);
    expect(await rightFeed(page).evaluate((el) => el.scrollTop)).toBe(0);
  });

  test('both side panels can stay open at once', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[data-project="fold"]').first().click();
    await expect(leftPanel(page)).toBeVisible();
    await expect(leftPanel(page).locator('h1')).toHaveText('Fold');
    expect(page.url()).toContain('left=fold');

    await page.locator('a[data-project="notations"]').first().click();
    await expect(leftPanel(page)).toBeVisible();
    await expect(rightPanel(page)).toBeVisible();
    await expect(rightPanel(page).locator('h1')).toHaveText('Notations');
    expect(page.url()).toContain('left=fold');
    expect(page.url()).toContain('right=notations');
  });

  test('closing a panel returns focus and scroll position to the opener', async ({ page }) => {
    await page.goto('/');
    const opener = page.locator('.entry-description a[data-project="interval"]');
    // Clicking deep in the feed auto-scrolls the column; capture where it lands.
    await opener.click();
    await expect(leftPanel(page)).toBeVisible();
    const browsePosition = await leftFeed(page).evaluate((el) => el.scrollTop);
    expect(browsePosition).toBeGreaterThan(0);

    await page.locator('button[data-close="left"]').click();
    await expect(leftPanel(page)).toBeHidden();
    expect(page.url()).not.toContain('left=');
    await expect(opener).toBeFocused();
    expect(await leftFeed(page).evaluate((el) => el.scrollTop)).toBe(browsePosition);
  });

  test('browser back and forward restore the panel state', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[data-project="fold"]').first().click();
    await expect(leftPanel(page)).toBeVisible();

    await page.goBack();
    await expect(leftPanel(page)).toBeHidden();
    expect(page.url()).not.toContain('left=');

    await page.goForward();
    await expect(leftPanel(page)).toBeVisible();
    expect(page.url()).toContain('left=fold');
  });

  test('a shared link opens its panel directly', async ({ page }) => {
    await page.goto('/?right=notations');
    await expect(rightPanel(page)).toBeVisible();
    await expect(rightPanel(page).locator('h1')).toHaveText('Notations');
    const permalink = rightPanel(page).locator('[data-permalink]');
    await expect(permalink).toHaveAttribute('href', /\/projects\/notations\/$/);
  });

  test('Escape closes the most recently opened panel', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[data-project="fold"]').first().click();
    await page.locator('a[data-project="notations"]').first().click();
    await expect(rightPanel(page)).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(rightPanel(page)).toBeHidden();
    await expect(leftPanel(page)).toBeVisible();
    expect(page.url()).toContain('left=fold');
    expect(page.url()).not.toContain('right=');
  });
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('groups switch and the detail panel fills the screen', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[data-switch="right"]').click();
    await expect(page.locator('[data-group="right"]')).toHaveAttribute('data-selected', 'true');

    await page.locator('a[data-project="notations"]').first().click();
    await expect(rightPanel(page)).toBeVisible();
    const box = await rightPanel(page).boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(390);

    await page.locator('button[data-close="right"]').click();
    await expect(rightPanel(page)).toBeHidden();
    await expect(page.locator('button[data-switch="right"]')).toBeVisible();
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 1280, height: 560 } });

  test('project links still reach their own pages', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[data-project="fold"]').first().click();
    await page.waitForURL(/\/projects\/fold\/$/);
    await expect(page.locator('h1')).toHaveText('Fold');
    await expect(page.getByRole('link', { name: 'Back to projects' })).toBeVisible();
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce', viewport: { width: 1280, height: 560 } });

  test('panels open and close without waiting for animation', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[data-project="fold"]').first().click();
    await expect(leftPanel(page)).toBeVisible();
    await page.locator('button[data-close="left"]').click();
    await expect(leftPanel(page)).toBeHidden({ timeout: 1000 });
  });
});
