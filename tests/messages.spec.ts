import test, { expect } from "@playwright/test";
import { navigateAndTestNavLogo } from "./reusableFunctions";

test.beforeEach(async ({page}, testInfo) => {
  test.slow();
  await navigateAndTestNavLogo(page);
});


test('test looking at messages as unauthenticated user flow', async ({ page }) => {
  const navlink = page.getByTestId("inbox");

  await Promise.all([
      navlink.dblclick(),
      page.waitForLoadState("networkidle")
  ]);
  const modal = page.getByTestId('loginmodal');

  await expect(modal).toBeVisible();
});
