
export interface UpdateProductForm {
    title?: string;
    description?: string;
    price?: number;
    attributes?: { [key:string]: any };
    productCategoryId?: number;
    images?: string[];
    latLong?: string;
    country?: string;
    tags?: string[];
    fieldsToUpdate: string[];
}

export interface ProductToDisplay {
    product: ProductRecord;
}

export interface ProductRecord {
    id: number;
    userId: string;
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

export interface ProductMarker {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    price: string;
}

export interface SimilarProductRecord extends ProductRecord {
    titleSimilarity: number;
    descriptionSimilarity: number;
    categorySimilarity: number;
}

export interface CreateProductForm {
    title?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    attributes?: { [key: string]: any } | undefined;
    productCategoryId?: number | undefined;
    images?: string[] | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    country?: string | undefined;
    tags?: string[] | undefined;
}


export interface LikedCommentParams {
    statusId: string;
    userId: string;
    liked: boolean;
}

export interface RePostCommentParams {
    statusId: string;
    userId: string;
    reposted: boolean;
}
