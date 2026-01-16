const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Strapi API Response type (Strapi 6 flattened structure)
 */
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Strapi API Error
 */
export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Fetch data from Strapi API
 * @param endpoint - API endpoint (e.g., "/apps", "/blog-posts")
 * @param options - Fetch options with optional revalidate time
 */
export async function fetchStrapi<T>(
  endpoint: string,
  options?: RequestInit & { revalidate?: number }
): Promise<StrapiResponse<T>> {
  const { revalidate = 3600, ...fetchOptions } = options || {};

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions?.headers,
  };

  // Add authorization header if token is available
  if (STRAPI_TOKEN) {
    (headers as Record<string, string>)["Authorization"] =
      `Bearer ${STRAPI_TOKEN}`;
  }

  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    ...fetchOptions,
    headers,
    next: {
      revalidate,
    },
  });

  if (!res.ok) {
    const error: StrapiError = await res.json().catch(() => ({
      status: res.status,
      name: "UnknownError",
      message: `Failed to fetch: ${endpoint}`,
    }));
    throw new Error(error.message);
  }

  return res.json();
}

/**
 * Build Strapi query string from parameters
 */
export function buildStrapiQuery(params: {
  populate?: string | string[] | Record<string, unknown>;
  filters?: Record<string, unknown>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  fields?: string[];
  locale?: string;
}): string {
  const searchParams = new URLSearchParams();

  // Handle locale
  if (params.locale) {
    searchParams.set("locale", params.locale);
  }

  // Handle populate
  if (params.populate) {
    if (typeof params.populate === "string") {
      searchParams.set("populate", params.populate);
    } else if (Array.isArray(params.populate)) {
      params.populate.forEach((p, i) => {
        searchParams.set(`populate[${i}]`, p);
      });
    } else {
      searchParams.set("populate", JSON.stringify(params.populate));
    }
  }

  // Handle filters
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        Object.entries(value as Record<string, unknown>).forEach(
          ([operator, operatorValue]) => {
            searchParams.set(
              `filters[${key}][${operator}]`,
              String(operatorValue)
            );
          }
        );
      } else {
        searchParams.set(`filters[${key}]`, String(value));
      }
    });
  }

  // Handle sort
  if (params.sort) {
    if (typeof params.sort === "string") {
      searchParams.set("sort", params.sort);
    } else {
      params.sort.forEach((s, i) => {
        searchParams.set(`sort[${i}]`, s);
      });
    }
  }

  // Handle pagination
  if (params.pagination) {
    if (params.pagination.page) {
      searchParams.set("pagination[page]", String(params.pagination.page));
    }
    if (params.pagination.pageSize) {
      searchParams.set(
        "pagination[pageSize]",
        String(params.pagination.pageSize)
      );
    }
  }

  // Handle fields
  if (params.fields) {
    params.fields.forEach((f, i) => {
      searchParams.set(`fields[${i}]`, f);
    });
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}
