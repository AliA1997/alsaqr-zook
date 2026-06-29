import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Pagination, PagingParams } from "@models/common";
import agent from "@utils/common";
import { ProductRecord, UpdateProductForm } from "@models/product";
import { store } from ".";
import { makePersistable } from "mobx-persist-store";

export default class UserProductsFeedStore {

    constructor() {
        makeAutoObservable(this);
        makePersistable(this, { name: 'UserProductsFeedStore', properties: ['buyingProductsRegistry', 'sellingProductsRegistry'], storage: window.localStorage });

        reaction(
            () => this.predicate.keys(),
            () => { }
        );
    }

    loadingInitial = false;
    predicate = new Map();
    setPredicate = (predicate: string, value: string | number | Date | undefined) => {
        if (value) {
            this.predicate.set(predicate, value);
        } else {
            this.predicate.delete(predicate);
        }
    }
    pagingParams: PagingParams = new PagingParams(1, 25);
    pagination: Pagination | undefined = undefined;

    sellingProductsRegistry: Map<number, ProductRecord> = new Map<number, ProductRecord>();
    buyingProductsRegistry: Map<number, ProductRecord> = new Map<number, ProductRecord>();

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (value: Pagination | undefined) => {
        this.pagination = value;
    }
    setSearchQry = (val: string) => this.predicate.set('searchQry', val);


    setSellingProduct = (productId: number, product: ProductRecord) => {
        this.sellingProductsRegistry.set(productId, product);
    }
    setBuyingProduct = (productId: number, product: ProductRecord) => {
        this.buyingProductsRegistry.set(productId, product);
    }
    
    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }

    resetFeedState = () => {
        this.predicate.clear();
        this.sellingProductsRegistry.clear();
        this.buyingProductsRegistry.clear();
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append("currentPage", this.pagingParams.currentPage.toString());
        params.append("itemsPerPage", this.pagingParams.itemsPerPage.toString());
        params.append("latitude", store.commonStore.userIpInfo?.latitude?.toString() ?? "27.7671");
        params.append("longitude", store.commonStore.userIpInfo?.longitude?.toString() ?? "82.6384");

        params.append('all', 'true');
        this.predicate.forEach((value, key) => params.append(key, value));

        return params;
    }

    loadSellingProducts = async () => {

        this.setLoadingInitial(true);
        
        try {
            this.sellingProductsRegistry.clear();
            const { items, pagination } = await agent.productApiClient.getSellingProducts(this.axiosParams) ?? [];

            runInAction(() => {
                items.forEach((product: ProductRecord) => {
                    this.setSellingProduct(product.id, product);
                });

            });

            this.setPagination(pagination);
        } finally {
            this.setLoadingInitial(false);
        }

    }

    loadBuyingProducts = async () => {

        this.setLoadingInitial(true);
        
        try {
            this.sellingProductsRegistry.clear();
            const { items, pagination } = await agent.productApiClient.getBuyingProducts(this.axiosParams) ?? [];

            runInAction(() => {
                items.forEach((product: ProductRecord) => {
                    this.setBuyingProduct(product.id, product);
                });

            });

            this.setPagination(pagination);
        } finally {
            this.setLoadingInitial(false);
        }

    }


    // Owner-only edit. The bearer token lets the API enforce that only the creator
    // can mutate the listing; this keeps the local selling registry in sync on success.
    updateProduct = async (values: UpdateProductForm, productId: number) => {
        await agent.productApiClient.updateProduct(values, productId);

        runInAction(() => {
            const existing = this.sellingProductsRegistry.get(productId);
            if (existing) {
                this.setSellingProduct(productId, { ...existing, ...this.toRecordPatch(values) });
            }
        });
    }

    // Owner-only delete. Removes the listing from the selling registry on success.
    deleteProduct = async (productId: number) => {
        await agent.productApiClient.deleteProduct(productId);

        runInAction(() => {
            this.sellingProductsRegistry.delete(productId);
        });
    }

    // Map the editable subset of UpdateProductForm onto the ProductRecord shape so the
    // card reflects the change without a full reload.
    private toRecordPatch = (values: UpdateProductForm): Partial<ProductRecord> => {
        const patch: Partial<ProductRecord> = {};
        if (values.title !== undefined) patch.title = values.title;
        if (values.description !== undefined) patch.description = values.description;
        if (values.price !== undefined) patch.price = values.price;
        if (values.tags !== undefined) patch.tags = values.tags;
        if (values.attributes !== undefined) patch.attributes = values.attributes;
        if (values.productCategoryId !== undefined) patch.productCategoryId = values.productCategoryId;
        if (values.images !== undefined) patch.images = values.images;
        return patch;
    }

    get nearbySellingProducts() {
        return Array.from(this.sellingProductsRegistry.values());
    }
    get nearbyBuyingProducts() {
        return Array.from(this.buyingProductsRegistry.values());
    }
}