import axios from "axios";
import { axiosRequests, axiosResponseBody } from "./common";
import { CreateProductForm, UpdateProductForm } from "@models/product";

export const productApiClient = {
    getCategory: (categoryId: number) => 
        axiosRequests.get(`/api/Category/${categoryId}`).then(axiosResponseBody),
    addProduct: (values: CreateProductForm) =>
        axiosRequests.post(`/api/Products`, { values }).then(axiosResponseBody),
    updateProduct: (values: UpdateProductForm, productId: number) =>
        axiosRequests.put(`/api/Products/${productId}`, { values }).then(axiosResponseBody),
    getSellingProducts: (params: URLSearchParams | undefined) =>
        axios.get(`/api/UserProducts/selling`, { params }).then(axiosResponseBody),
    getBuyingProducts: (params: URLSearchParams | undefined) =>
        axios.get(`/api/UserProducts/buying`, { params }).then(axiosResponseBody),
    getNearbyProducts: (params: URLSearchParams | undefined) =>
        axios.get(`/api/Products`, { params }).then(axiosResponseBody),
    getNearbyProductsOnCategory: (params: URLSearchParams | undefined, categoryId: number) =>
        axios.get(`/api/Products/${categoryId}`, { params }).then(axiosResponseBody),
    getProduct: (params: URLSearchParams, productId: number) =>
        axios.get(`/api/ProductDetails/${productId}`, { params }).then(axiosResponseBody),
    getSimilarProducts: (params: URLSearchParams, productId: number) =>
        axios.get(`/api/ProductDetails/${productId}/marquee`, { params }).then(axiosResponseBody),
}