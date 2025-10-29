
export interface CreateProductForm {
    title?: string;
    description?: string;
    price?: number;
    attributes?: { [key:string]: any };
    productCategoryId?: number;
    images?: string[];
    latLong?: string;
    country?: string;
    tags?: string[];
}

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
}

export interface SimilarProductRecord extends ProductRecord {
    titleSimilarity: number;
    descriptionSimilarity: number;
    categorySimilarity: number;
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
