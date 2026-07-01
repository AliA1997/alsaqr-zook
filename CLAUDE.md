# ALSaqr Zook — Marketplace Portal

> The **Zook** portal is the marketplace tenant of the ALSaqr application ecosystem. It is the **source of truth for products** — listings, categories, selling, and buying. The native social app (`alsaqr-2026`) and other tenants port Zook's `ProductRecord` model, `productApiClient`, and product feed stores; **do not redesign those when other projects consume them.** This portal shares the exact architecture of its sibling projects (`alsaqr-2026`, `alsaqr-meetup`): the same `stores` / `utils` / `models` / `features` layout, the same axios + MobX feed-store conventions, and the same Supabase-owns-auth / axios-owns-data split.

## Tech Stack
- React 18.3.1
- TypeScript 5.5.3
- Eslint 9.9.0
- Typescript eslint 8.0.1
- Vite 5.4.1 (+ `vite-tsconfig-paths` for `@models` / `@utils` / `@stores` path aliases)
- Playwright +1.56.1
- Framer Motion +12.23.24
- Mobx +6.15.0 (+ `mobx-react-lite`, `mobx-persist-store`)
- Formik 2.4.6
- Tailwind CSS 4.1.14 (+ `@tailwindcss/vite`, `tailwind-scrollbar`, `tailwind-scrollbar-hide`)
- Supabase Client +2.76.0 (auth/session only)
- React Router +7.9.4 (`react-router` + `react-router-dom`)
- Axios +1.12.2 (api client layer — see Architectural Principles)
- **Marketplace-specific UI deps:**
    - `leaflet` +1.9.4 / `@types/leaflet` — product geolocation maps (`ProductRecord` carries `latitude` / `longitude`).
    - `embla-carousel-react` / `embla-carousel-autoplay` — product image galleries (`ProductRecord.images` is `string[]`).
    - `react-to-pdf` +2.0.1 — export order summaries / listing receipts / invoices to PDF.
    - `react-hot-toast` — user-facing notifications for marketplace actions (list, buy, save).
    - `react-timeago` — relative timestamps on listings ("posted 3 hours ago").
    - `@emoji-mart/react` / `@emoji-mart/data` — emoji input for product Q&A / reviews.
    - `@heroicons/react` — icon set.
    - `universal-cookie` — cookie access (shared session/locale cookies across tenants).

## Architectural Principles
- **Routing with `react-router-dom` v7.** This portal uses React Router (data router + search/route params), **not** tan-stack router. Match the existing route tree; do not introduce a second router.
- Components separated by `features`, `components`, `layout`, and `common` folders.
- Environment variables held in `.env` files:
    - `.env` on prod
    - `.env.local` on dev
    - api base url read from `VITE_PUBLIC_BASE_API_URL`
- Playwright tests are in the `tests` folder.
- Web workers for loading data on app initialization.
- Check session on initialization of the web application. **Supabase client owns auth/session only; data access does NOT go through the Supabase client** — all data reads/writes go through the axios api client layer (see below).
- Mobx stores in the `stores` folder.
- **Persisted stores use `mobx-persist-store`.** Stores whose state should survive reloads — cart / saved listings, marketplace search filters, recently-viewed products — opt in via `makePersistable`. Ephemeral feed stores (paginated listings) do **not** persist; they reload from the server. Keep the persisted surface small and explicit.
- TypeScript models and enums in the `models` folder.
- `typings.d.ts` holds common-use models, excluding enums.
- `utils` folder holds utility functions used across multiple components.
    - `utils` folder holds the api client files responsible for communicating with the server.
    - Api clients are **axios object literals** named `xxxApiClient`, each method returning `axios.get(url, { params }).then(axiosResponseBody)`. Query params are passed as `URLSearchParams`. All clients are aggregated into the default `agent` export in `utils/common.ts`.
    - Pagination is server-driven: a response interceptor reads the `pagination` header and wraps the body in `PaginatedResult<T>` (`{ data, pagination }`). Pages use `currentPage` (default 1) and `itemsPerPage` (default 25).
- **Proximity is a first-class concern.** Listings are sorted/filtered by distance from the user. Feed stores append `latitude` / `longitude` (from `store.commonStore.userIpInfo`) to their `axiosParams`, mirroring `alsaqr-meetup`'s group/event proximity convention.

## Code Standards
- DRY.
- `useMemo` and `useCallback` for variable declarations that are not state.
- Use the `useState` hook for components that load data unique to a single entity — e.g. a product detail page loading one product by slug.
- For upserting data, use Formik components.
    - Use the mobx store to control the form between steps in a wizard — e.g. the multi-step **create/edit listing** flow (details → images → location → pricing → review).
- Use Tailwind CSS classes for styling; do not use inline styles unless specified. Scrollbar styling goes through `tailwind-scrollbar` / `tailwind-scrollbar-hide` utilities, not custom CSS.
- camelCase naming convention for all non-component variables.
- PascalCase naming convention for React components.
- Entity record models are named `XxxRecord` (e.g. `ProductRecord`, `ProductCategoryRecord`). Their `id` is a numeric `number`, unlike the uuid-string ids used by native social entities. Note `ProductRecord.userId` **is** a uuid string (it references a social-app user).

## SDD Workflow

### Specification
- Client-side marketplace application where users log in via OAuth (Supabase session, shared across ALSaqr tenants) and can:
    - **Browse and search** products by category, tags, free-text, and **proximity** (nearest first).
    - **List a product for sale** — create/edit a listing with a title, description, price, multiple images, a category, free-form tags, arbitrary `attributes`, and a map-pinned location.
    - **View a product detail page** — image carousel, description, attributes, seller info, relative post time, and a map showing the listing's location.
    - **Sell** products (their own active listings) and **buy** products (listings they have purchased / transacted on).
    - **Save** listings (persisted locally) and receive **toast** confirmations for marketplace actions.
    - **Export** an order summary / receipt for a transaction to **PDF**.
- A product belongs to exactly one **category** (`productCategoryId` / `category`) and carries zero or more **tags** and an open `attributes` map for category-specific fields.
- The two user-scoped feeds — **selling** and **buying** — are the surfaces consumed by the native social app's profile (`/api/UserProducts/selling`, `/api/UserProducts/buying`). **Their shape is a public contract; changing the response shape is a breaking change for `alsaqr-2026`.**

> **Provenance & data model.** Products originate **here**, in `alsaqr-zook` (https://github.com/AliA1997/alsaqr-zook). The social app and other tenants port the `ProductRecord` model, the `productApiClient`, and the selling/buying feed stores from this project — they do not own them. There is no single "my products" endpoint; products split into **selling** (`/api/UserProducts/selling`) and **buying** (`/api/UserProducts/buying`). Keep these two endpoints, their params, and their response shapes stable.

### Technical Planning
- When loading data that needs to be **set and shared**, use a store.
- When a **distinct page** loads data unique to one entity — a product detail page, a category landing page, a seller profile — use the api client data-access object directly with `useState`.
- **The marketplace listing feeds (browse, selling, buying) are paginated feeds, so they use the STORE pattern, not `useState`.** Each feed gets a dedicated MobX feed store modeled on `alsaqr-meetup`'s `MyGroupsFeedStore` / `MyEventsFeedStore`: a `predicate` Map for filters/search, `pagingParams` + `pagination`, a `Map<number, ProductRecord>` registry, an `axiosParams` getter (including proximity lat/long), and a `loadXxx` action that calls the matching `agent.productApiClient` method inside `runInAction`.
- Each feed store reads from an axios api client method:
    - marketplace browse → `agent.productApiClient.getProducts(params)` → `/api/Products`
    - selling → `agent.productApiClient.getSellingProducts(params)` → `/api/UserProducts/selling`
    - buying → `agent.productApiClient.getBuyingProducts(params)` → `/api/UserProducts/buying`
    - single product → `agent.productApiClient.getProductBySlug(slug)` → `/api/Products/{slug}`
    - categories → `agent.productCategoryApiClient.getCategories()` → `/api/ProductCategories`
- **Maps & carousels are presentation, not data.** Leaflet and Embla render data already in the store/component; never fetch from inside a map/carousel component.

### Task Breakdown
- Most of the project is complete. Do not scaffold new features from scratch; follow the user prompt for **maintenance, fixes, or enhancements only**, respecting the conventions above.
- When touching the **selling / buying** endpoints or the `ProductRecord` shape, treat them as a published contract consumed by `alsaqr-2026`. Coordinate any change; additive nullable fields only.
- Port, don't reinvent. The model, api client, and feed-store conventions here are the canonical ones the other tenants copy — keep them clean and stable.

### Implementation
- All features described in the Specification are implemented and integrated.
- The marketplace feeds follow the reference patterns below.

#### Reference patterns — Marketplace

**Model** — canonical `ProductRecord` (other tenants copy this verbatim).
```typescript
// models/product.ts  (source of truth for the whole ecosystem)
export interface ProductRecord {
  id: number;
  userId: string;                       // uuid — references an alsaqr-2026 user
  title: string;
  description: string;
  price: number;
  images: string[];
  slug: string;
  attributes: { [key: string]: any };
  tags: string[];
  productCategoryId: number;
  category: string;
  latitude: number;
  longitude: number;
}

// models/productCategory.ts
export interface ProductCategoryRecord {
  id: string;
  name: string;
}
```

**Enum** (`models/enums.ts`) — extend, don't replace.
```typescript
export enum MarketplaceTab {
  Browse = 'browse',
  Selling = 'selling',
  Buying = 'buying',
  Saved = 'saved',
}

export enum ListingStep {
  Details = 'details',
  Images = 'images',
  Location = 'location',
  Pricing = 'pricing',
  Review = 'review',
}
```

**API client** — axios object literal, registered in the `agent` aggregator.
```typescript
// utils/productApiClient.ts
import axios from "axios";
import { axiosResponseBody } from "./common";

export const productApiClient = {
  getProducts: (params: URLSearchParams | undefined) =>
    axios.get(`/api/Products`, { params }).then(axiosResponseBody),
  getProductBySlug: (slug: string) =>
    axios.get(`/api/Products/${slug}`).then(axiosResponseBody),
  getSellingProducts: (params: URLSearchParams | undefined) =>
    axios.get(`/api/UserProducts/selling`, { params }).then(axiosResponseBody),
  getBuyingProducts: (params: URLSearchParams | undefined) =>
    axios.get(`/api/UserProducts/buying`, { params }).then(axiosResponseBody),
};

// utils/productCategoryApiClient.ts
export const productCategoryApiClient = {
  getCategories: () =>
    axios.get(`/api/ProductCategories`).then(axiosResponseBody),
};

// utils/common.ts — add the clients to the aggregated agent
const agent = {
  // ...existing clients
  productApiClient,
  productCategoryApiClient,
};
export default agent;
```

**Feed store** (`stores/productsFeedStore.ts`) — modeled on the real `MyGroupsFeedStore`. The selling and buying stores are structurally identical; swap the `agent.productApiClient` call. Registry is keyed by the numeric `id`.
```typescript
import { makeAutoObservable, runInAction } from "mobx";
import { Pagination, PagingParams } from "@models/common";
import { ProductRecord } from "@models/product";
import agent from "@utils/api/agent";
import { store } from ".";

export default class ProductsFeedStore {
  loadingInitial = false;
  predicate = new Map();
  pagingParams: PagingParams = new PagingParams(1, 25);
  pagination: Pagination | undefined = undefined;
  productRegistry: Map<number, ProductRecord> = new Map<number, ProductRecord>();

  constructor() {
    makeAutoObservable(this);
  }

  setLoadingInitial = (value: boolean) => { this.loadingInitial = value; };
  setPagination = (value: Pagination | undefined) => { this.pagination = value; };
  setProduct = (productId: number, product: ProductRecord) => { this.productRegistry.set(productId, product); };
  resetFeedState = () => { this.predicate.clear(); this.productRegistry.clear(); };

  get products() {
    return Array.from(this.productRegistry.values());
  }

  get axiosParams() {
    const params = new URLSearchParams();
    params.append("currentPage", this.pagingParams.currentPage.toString());
    params.append("itemsPerPage", this.pagingParams.itemsPerPage.toString());
    params.append("latitude", store.commonStore.userIpInfo?.latitude?.toString() ?? "27.7671");
    params.append("longitude", store.commonStore.userIpInfo?.longitude?.toString() ?? "82.6384");
    this.predicate.forEach((value, key) => params.append(key, value));
    return params;
  }

  loadProducts = async () => {
    this.setLoadingInitial(true);
    try {
      const { items, pagination } = await agent.productApiClient.getProducts(this.axiosParams);
      runInAction(() => {
        items.forEach((product: ProductRecord) => this.setProduct(product.id, product));
        this.setPagination(pagination);
      });
    } finally {
      this.setLoadingInitial(false);
    }
  };
}
```

**Persisted store** (`stores/savedListingsStore.ts`) — uses `mobx-persist-store` so saved listings survive reloads. Persist only ids/lightweight state, not full feed pages.
```typescript
import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

export default class SavedListingsStore {
  savedIds: number[] = [];

  constructor() {
    makeAutoObservable(this);
    void makePersistable(this, {
      name: "zook-saved-listings",
      properties: ["savedIds"],
      storage: window.localStorage,
    });
  }

  toggleSaved = (productId: number) => {
    this.savedIds = this.savedIds.includes(productId)
      ? this.savedIds.filter((id) => id !== productId)
      : [...this.savedIds, productId];
  };

  isSaved = (productId: number) => this.savedIds.includes(productId);
}
```

**Store registration** (`stores/index.ts`) — add to both the `Store` interface and the `store` object.
```typescript
import ProductsFeedStore from './productsFeedStore';
import SellingProductsFeedStore from './sellingProductsFeedStore';
import BuyingProductsFeedStore from './buyingProductsFeedStore';
import SavedListingsStore from './savedListingsStore';
// interface Store { ... productsFeedStore: ProductsFeedStore; sellingProductsFeedStore: SellingProductsFeedStore; buyingProductsFeedStore: BuyingProductsFeedStore; savedListingsStore: SavedListingsStore; ... }
// export const store: Store = { ... productsFeedStore: new ProductsFeedStore(), sellingProductsFeedStore: new SellingProductsFeedStore(), buyingProductsFeedStore: new BuyingProductsFeedStore(), savedListingsStore: new SavedListingsStore(), ... }
```

**Feed tab component** (`features/marketplace/components/SellingTab.tsx`) — feed data lives in the store, so the component is an `observer` reading from `useStore()`; `useEffect` triggers the load. Keep one shared loading/empty treatment across browse / selling / buying to stay DRY.
```tsx
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../stores';

export const SellingTab = observer(function SellingTab() {
  const { sellingProductsFeedStore } = useStore();
  const { products, loadingInitial, loadSellingProducts, resetFeedState } = sellingProductsFeedStore;

  useEffect(() => {
    void loadSellingProducts();
    return () => resetFeedState();
  }, [loadSellingProducts, resetFeedState]);

  if (loadingInitial) {
    return <div className="p-4 text-sm text-gray-400">Loading listings…</div>;
  }
  if (products.length === 0) {
    return <div className="p-4 text-sm text-gray-400">No active listings yet.</div>;
  }

  return (
    <ul className="divide-y divide-gray-800">
      {products.map((product) => (
        <li key={product.id} className="flex items-center gap-3 p-4">
          <span className="font-medium">{product.title}</span>
          <span className="ml-auto text-sm text-gray-400">
            ${product.price} · {product.category}
          </span>
        </li>
      ))}
    </ul>
  );
});
```

**Product detail** — image carousel + map are presentation only.
```tsx
// Embla carousel for ProductRecord.images (autoplay optional)
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
// const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);

// Leaflet map pinned to product.latitude / product.longitude.
// Render from data already in state; never fetch inside the map component.
```

**Create/edit listing wizard** — Formik for fields, a MobX store to carry state across `ListingStep` values, `react-hot-toast` for the success/error confirmation on submit.

**PDF export** — order summaries / receipts use `react-to-pdf` against a dedicated printable component; do not hand-build PDFs.

**Wiring into the marketplace route** — switch on the active `MarketplaceTab` value from the `react-router-dom` search params (`useSearchParams`) and render the matching observer tab component. Single-entity pages (product detail by slug, category landing) use route params (`useParams`) and the api client directly.

### Validation
- Validated via the Playwright test suite located in the `tests` folder. Run the suite before merging any change.
- The marketplace feeds (browse, selling, buying, saved) must each have Playwright coverage: tab renders, populated state, and empty state.
- Additionally cover: product detail page (carousel renders, map renders, relative timestamp shows), the create/edit listing wizard (step navigation + Formik validation + toast on submit), and PDF export of an order summary.
- The **selling / buying** endpoint contracts are consumed by `alsaqr-2026`; add a regression test asserting their response shape stays stable. Do not merge below the existing coverage bar.