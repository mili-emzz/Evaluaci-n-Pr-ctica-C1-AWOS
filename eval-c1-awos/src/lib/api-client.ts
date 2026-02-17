const API_BASE = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';

export async function fetchAPI<T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> {
  const url = new URL(`/api${endpoint}`, API_BASE);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("API ERROR:", text);
    throw new Error(text || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  salesDaily: (params?: { date_from?: string; date_to?: string }) =>
    fetchAPI<{ rows: any[] }>('/reports/sales-daily', params),

  topProducts: (params?: { search?: string; page?: number; limit?: number }) =>
    fetchAPI<{ rows: any[]; page: number; limit: number }>('/reports/top-products', params),

  inventoryRisk: (params?: { category_id?: number }) =>
    fetchAPI<{ rows: any[]; selectedCategory?: number }>('/reports/inventory-risk', params),

  customerValue: (params?: { page?: number; limit?: number }) =>
    fetchAPI<{ rows: any[]; page: number; limit: number }>('/reports/customer-value', params),

  paymentMix: () =>
    fetchAPI<{ rows: any[] }>('/reports/payment-mix'),
};