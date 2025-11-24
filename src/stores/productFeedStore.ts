import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Pagination, PagingParams } from "@models/common";
import agent from "@utils/common";
import { CreateProductForm, ProductRecord } from "@models/product";
import { store } from ".";
import { DEFAULT_CREATE_PRODUCT_FORM } from "@utils/constants";
import { makePersistable } from 'mobx-persist-store';

export default class ProductFeedStore {

    constructor() {
        makeAutoObservable(this);

        makePersistable(this, { name: 'ProductFeedStore', properties: ['productToViewId', 'productsRegistry'], storage: window.localStorage });

        reaction(
            () => this.predicate.keys(),
            () => { }
        );
    }


    loadingInitial = false;
    loadingUpsert = false;
    predicate = new Map();
    productToViewId: number | undefined;
    setPredicate = (predicate: string, value: string | number | Date | undefined) => {
        if (value) {
            this.predicate.set(predicate, value);
        } else {
            this.predicate.delete(predicate);
        }
    }
    pagingParams: PagingParams = new PagingParams(1, 25);
    pagination: Pagination | undefined = undefined;

    productsRegistry: Map<number, ProductRecord> = new Map<number, ProductRecord>();
    activeMarker: number | undefined = undefined;
    currentProductSlug: string = "";
    createProductForm: CreateProductForm = DEFAULT_CREATE_PRODUCT_FORM;
    createProductFormStep: number = 0;
    setCreateProductForm = (val: CreateProductForm) => {
        this.createProductForm = val;
    }
    setCreateProductFormStep = (val: number) => {
        this.createProductFormStep = val;
    }

    setActiveMarker = (val: number | undefined) => {
        this.activeMarker = val;
    }
    setCurrentProductSlug = (productSlug: string) => {
        this.currentProductSlug = productSlug;
    }
    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (value: Pagination | undefined) => {
        this.pagination = value;
    }
    setSearchQry = (val: string) => this.predicate.set('searchQry', val);


    setProduct = (productId: number, product: ProductRecord) => {
        this.productsRegistry.set(productId, product);
    }
    setProductToViewId = (productId: number | undefined) => {
        this.productToViewId = productId;
    }
    
    setLoadingUpsert = (value: boolean) => {
        this.loadingUpsert = value;
    }
    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }

    resetFeedState = () => {
        this.predicate.clear();
        this.productsRegistry.clear();
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

    loadProducts = async () => {

        this.setLoadingInitial(true);
        
        try {
            this.productsRegistry.clear();
            const { items, pagination } = await agent.productApiClient.getNearbyProducts(this.axiosParams) ?? [];

            runInAction(() => {
                items.forEach((product: ProductRecord) => {
                    this.setProduct(product.id, product);
                });

            });

            this.setPagination(pagination);
        } finally {
            this.setLoadingInitial(false);
        }

    }

    createProduct = async (values: CreateProductForm) => {

        this.setLoadingUpsert(true);
        
        try {
            await agent.productApiClient.addProduct(values) ?? [];
            this.setCreateProductForm(DEFAULT_CREATE_PRODUCT_FORM);
            this.setCreateProductFormStep(0);

        } finally {
            this.setLoadingUpsert(false);
        }

    }


    get nearbyProducts() {
        return Array.from(this.productsRegistry.values());
    }
}