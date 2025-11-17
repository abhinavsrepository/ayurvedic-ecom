'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from '@/app/actions/products';
import type { ProductListParams, ProductCreateRequest, ProductUpdateRequest } from '@/lib/api/schemas';

export function useProducts(params?: Partial<ProductListParams>) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useProduct(slug: string | null) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => (slug ? getProductBySlug(slug) : Promise.resolve(null)),
    enabled: !!slug,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductCreateRequest) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: ProductUpdateRequest }) =>
      updateProduct(productId, data),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', updatedProduct.slug] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
