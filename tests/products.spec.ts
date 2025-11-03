import { expect, test } from '@playwright/test';
import { 
  navigateAndTestNavLogo,
  clickLinkAndNavigateAndTestProducts,
  clickProductCardAndNavigateAndTestProductsDetails
} from './reusableFunctions';


test.beforeEach(async ({page}, testInfo) => {
  test.slow();
  await navigateAndTestNavLogo(page);
});

test('test vehicles feed flow', async ({ page }) => {
  const productCard = await clickLinkAndNavigateAndTestProducts(page, 'vehicles', '/vehicles');
  const similarProductCard = await clickProductCardAndNavigateAndTestProductsDetails(page, productCard);
  const origUrl = page.url();
  await clickProductCardAndNavigateAndTestProductsDetails(page, similarProductCard);
  const newUrl = page.url();

  expect(origUrl).not.toEqual(newUrl);
});

test('test rentals feed flow', async ({ page }) => {
  const productCard = await clickLinkAndNavigateAndTestProducts(page, 'rentals', '/rentals');
  const similarProductCard = await clickProductCardAndNavigateAndTestProductsDetails(page, productCard);
  const origUrl = page.url();
  await clickProductCardAndNavigateAndTestProductsDetails(page, similarProductCard);
  const newUrl = page.url();

  expect(origUrl).not.toEqual(newUrl);
});

test('test clothing feed flow', async ({ page }) => {
  const productCard = await clickLinkAndNavigateAndTestProducts(page, 'clothing', '/clothing');
  const similarProductCard = await clickProductCardAndNavigateAndTestProductsDetails(page, productCard);
  const origUrl = page.url();
  await clickProductCardAndNavigateAndTestProductsDetails(page, similarProductCard);
  const newUrl = page.url();

  expect(origUrl).not.toEqual(newUrl);
});

test('test electronics feed flow', async ({ page }) => {
  const productCard = await clickLinkAndNavigateAndTestProducts(page, 'electronics', '/electronics');
  const similarProductCard = await clickProductCardAndNavigateAndTestProductsDetails(page, productCard);
  const origUrl = page.url();
  await clickProductCardAndNavigateAndTestProductsDetails(page, similarProductCard);
  const newUrl = page.url();

  expect(origUrl).not.toEqual(newUrl);
});


test('test office supplies feed flow', async ({ page }) => {
  const productCard = await clickLinkAndNavigateAndTestProducts(page, 'office supplies', '/office-supplies');
  const similarProductCard = await clickProductCardAndNavigateAndTestProductsDetails(page, productCard);
  const origUrl = page.url();
  await clickProductCardAndNavigateAndTestProductsDetails(page, similarProductCard);
  const newUrl = page.url();

  expect(origUrl).not.toEqual(newUrl);
});

test('test pet supplies feed flow', async ({ page }) => {
  const productCard = await clickLinkAndNavigateAndTestProducts(page, 'pet supplies', '/pet-supplies');
  const similarProductCard = await clickProductCardAndNavigateAndTestProductsDetails(page, productCard);
  const origUrl = page.url();
  await clickProductCardAndNavigateAndTestProductsDetails(page, similarProductCard);
  const newUrl = page.url();

  expect(origUrl).not.toEqual(newUrl);
});

test('test sporting goods supplies feed flow', async ({ page }) => {
  const productCard = await clickLinkAndNavigateAndTestProducts(page, 'sporting goods', '/sporting-goods');
  const similarProductCard = await clickProductCardAndNavigateAndTestProductsDetails(page, productCard);
  const origUrl = page.url();
  await clickProductCardAndNavigateAndTestProductsDetails(page, similarProductCard);
  const newUrl = page.url();

  expect(origUrl).not.toEqual(newUrl);
});

test('test toys and games feed flow', async ({ page }) => {
  const productCard = await clickLinkAndNavigateAndTestProducts(page, 'toys and games', '/toys-and-games');
  const similarProductCard = await clickProductCardAndNavigateAndTestProductsDetails(page, productCard);
  const origUrl = page.url();
  await clickProductCardAndNavigateAndTestProductsDetails(page, similarProductCard);
  const newUrl = page.url();

  expect(origUrl).not.toEqual(newUrl);
});

test('test buying supplies feed flow', async ({ page }) => {
  const productCard = await clickLinkAndNavigateAndTestProducts(page, 'buying', '/buying');
  const similarProductCard = await clickProductCardAndNavigateAndTestProductsDetails(page, productCard);
  const origUrl = page.url();
  await clickProductCardAndNavigateAndTestProductsDetails(page, similarProductCard);
  const newUrl = page.url();

  expect(origUrl).not.toEqual(newUrl);
});
