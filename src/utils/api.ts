const BASE_URL = 'https://api.escuelajs.co/api/v1';

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: ProductCategory;
  images: string[];
  creationAt: string;
  updatedAt: string;
}

export interface ProductsParams {
  title?: string;
  price?: number;
  price_min?: number;
  price_max?: number;
  categoryId?: number;
  limit?: number;
  offset?: number;
}

export const productsApi = {
  getAll: async (params?: ProductsParams): Promise<Product[]> => {
    const searchParams = new URLSearchParams();
    if (params?.title) searchParams.append('title', params.title);
    if (params?.price) searchParams.append('price', params.price.toString());
    if (params?.price_min) searchParams.append('price_min', params.price_min.toString());
    if (params?.price_max) searchParams.append('price_max', params.price_max.toString());
    if (params?.categoryId) searchParams.append('categoryId', params.categoryId.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    
    const url = `${BASE_URL}/products${searchParams.toString() ? `?${searchParams}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  getById: async (id: number): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },
};

export const categoriesApi = {
  getAll: async (): Promise<ProductCategory[]> => {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  getById: async (id: number): Promise<ProductCategory> => {
    const res = await fetch(`${BASE_URL}/categories/${id}`);
    if (!res.ok) throw new Error('Failed to fetch category');
    return res.json();
  },
};
