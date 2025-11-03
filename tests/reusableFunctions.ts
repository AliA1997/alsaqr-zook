import { expect, Locator, Page } from "@playwright/test";

export const navigateAndTestNavLogo = async (page: Page) => {
    page.goto(`${process.env.VITE_PUBLIC_BASE_URL}/`);
    await page.waitForLoadState("load");
    const navLogo = page.getByTestId("navlogo");

    await expect(navLogo).toBeVisible();
}

export const clickLinkAndNavigateAndTestProducts = async (page: Page, link: string, expectLinkSuffix: string): Promise<Locator>  => {
    const navlink = page.getByTestId(link);

    await Promise.all([
        navlink.dblclick(),
        page.waitForLoadState("networkidle")
    ]);
    const actualUrl = page.url();
    expect(actualUrl.includes(expectLinkSuffix)).toBeTruthy();

    const productCard = page.getByTestId("productcard").first();
    const productTitle = page.getByTestId("producttitle").first();
    await expect(productCard).toBeVisible();
    await expect(productTitle).toBeVisible();

    return productCard;
}


export const clickProductCardAndNavigateAndTestProductsDetails = async (page: Page, productCard: Locator): Promise<Locator>  => {;

    await Promise.all([
        productCard.dblclick(),
        page.waitForLoadState("networkidle")
    ]);

    const productDetailsCard = page.getByTestId("productdetailscard").first();
    const productDetailsPrice = page.getByTestId("productdetailsprice").first();
    const productsMarquee = page.getByTestId("productmarquee").first();
    const similarProductCard = page.getByTestId("similarproductcard").first();

    await expect(productDetailsCard).toBeVisible();
    await expect(productDetailsPrice).toBeVisible();
    await expect(productsMarquee).toBeVisible();
    await expect(similarProductCard).toBeVisible();

    return similarProductCard;
}