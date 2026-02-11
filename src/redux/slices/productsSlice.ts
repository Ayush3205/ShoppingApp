import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsApi, categoriesApi, Product, ProductCategory, ProductsParams } from '../../utils/api';

interface ProductsState {
  products: Product[];
  categories: ProductCategory[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  filteredProducts: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params?: ProductsParams) => productsApi.getAll(params)
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number) => productsApi.getById(id)
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  () => categoriesApi.getAll()
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (params: ProductsParams) => productsApi.getAll(params)
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.filteredProducts = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.filteredProducts = action.payload;
      });
  },
});

export const { setFilteredProducts, clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
