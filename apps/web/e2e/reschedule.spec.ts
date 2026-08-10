import { expect, test, type Locator, type Page } from '@playwright/test';

import { openReadyPage } from './navigation';

/**
 * Drag and keyboard have to be the same operation.
 *
 * Both routes are asked for the same move, one calendar day forward at the same
 * hour, and the confirmation dialog they open is compared by the two machine
 * readable instants it prints. If a drop ever computes its own time, or skips
 * the confirmation, these two readings stop matching.
 */

interface AdjacentCells {
  readonly source: string;
  readonly target: string;
}

/** The first movable post that has another cell beside it in the same band. */
async function findAdjacentCells(page: Page): Promise<AdjacentCells | null> {
  return page.evaluate<AdjacentCells | null>(() => {
    const handles = Array.from(document.querySelectorAll('[data-move-handle]'));
    for (const handle of handles) {
      const cell = handle.closest('[data-drop-instant]');
      const next = cell?.nextElementSibling ?? null;
      const source = cell?.getAttribute('data-drop-instant') ?? null;
      const target = next instanceof HTMLElement ? next.getAttribute('data-drop-instant') : null;
      if (source && target) return { source, target };
    }
    return null;
  });
}

/** The `from` and `to` instants the confirmation prints, in document order. */
async function confirmedInstants(dialog: Locator): Promise<readonly (string | null)[]> {
  return dialog
    .locator('time')
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('datetime')));
}

test.describe('rescheduling a post', () => {
  test('drag and the keyboard open the same confirmation for the same move', async ({ page }) => {
    await openReadyPage(page, '/calendar');

    const cells = await findAdjacentCells(page);
    test.skip(cells === null, 'The demo calendar has no movable post in the visible week');
    if (!cells) return;

    const handle = page.locator(`[data-drop-instant="${cells.source}"] [data-move-handle]`).first();
    await expect(handle).toBeVisible();

    /* The keyboard route: pick up, step one day, confirm. */
    await handle.click();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toBeVisible();
    const byKeyboard = await confirmedInstants(dialog);
    expect(byKeyboard.length).toBeGreaterThanOrEqual(2);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    /* The pointer route: the same handle, dropped on the cell beside it. */
    const targetCell = page.locator(`[data-drop-instant="${cells.target}"]`).first();
    const box = await targetCell.boundingBox();
    expect(box, 'the drop target should be laid out').not.toBeNull();
    if (!box) return;

    await handle.hover();
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 12 });
    await page.mouse.up();

    await expect(dialog).toBeVisible();
    expect(await confirmedInstants(dialog)).toEqual(byKeyboard);
  });

  test('a cancelled drop leaves the post exactly where it was', async ({ page }) => {
    await openReadyPage(page, '/calendar');

    const cells = await findAdjacentCells(page);
    test.skip(cells === null, 'The demo calendar has no movable post in the visible week');
    if (!cells) return;

    const sourceCell = page.locator(`[data-drop-instant="${cells.source}"]`).first();
    const targetCell = page.locator(`[data-drop-instant="${cells.target}"]`).first();
    const before = await sourceCell.locator('article[data-entry-key]').count();
    const beforeTarget = await targetCell.locator('article[data-entry-key]').count();

    const handle = sourceCell.locator('[data-move-handle]').first();
    const box = await targetCell.boundingBox();
    if (!box) return;

    await handle.hover();
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 12 });
    await page.mouse.up();

    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    /* Nothing was written and nothing moved optimistically, so the cell that
       held the post still holds it. */
    await expect(sourceCell.locator('article[data-entry-key]')).toHaveCount(before);
    await expect(targetCell.locator('article[data-entry-key]')).toHaveCount(beforeTarget);
  });

  test('the move handle is a keyboard reachable button, not a drag-only target', async ({
    page,
  }) => {
    await openReadyPage(page, '/calendar');

    const handle = page.locator('[data-move-handle]').first();
    test.skip((await handle.count()) === 0, 'The demo calendar has no movable post');

    await expect(handle).toHaveRole('button');
    const size = await handle.boundingBox();
    expect(size, 'the handle should be laid out').not.toBeNull();
    // WCAG 2.2 target size (minimum).
    expect(size?.width ?? 0).toBeGreaterThanOrEqual(24);
    expect(size?.height ?? 0).toBeGreaterThanOrEqual(24);

    await handle.focus();
    await expect(handle).toBeFocused();
    await page.keyboard.press('Enter');
    // Picked up from the keyboard alone, with no pointer involved at all.
    await expect(page.locator('article[data-grabbed]')).toHaveCount(1);
  });
});
