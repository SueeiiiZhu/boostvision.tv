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

  // Normalize URL to avoid double slashes
  const baseUrl = STRAPI_URL.replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}/api${cleanEndpoint}`;

  const res = await fetch(url, {
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

  const json = await res.json();
  return transformMediaUrls(json);
}

/**
 * Recursively transform relative Strapi URLs to absolute ones
 */
function transformMediaUrls(data: any): any {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map((item) => transformMediaUrls(item));
  }

  if (typeof data === "object") {
    const newData: any = { ...data };

    for (const key in newData) {
      if (
        key === "url" &&
        typeof newData[key] === "string" &&
        newData[key].startsWith("/")
      ) {
        const baseUrl = STRAPI_URL.replace(/\/$/, "");
        newData[key] = `${baseUrl}${newData[key]}`;
      } else {
        newData[key] = transformMediaUrls(newData[key]);
      }
    }
    return newData;
  }

  return data;
}

/**
 * Build Strapi query string from parameters (Standard Bracket Notation)
 */
export function buildStrapiQuery(params: any): string {
  const searchParams = new URLSearchParams();

  const flatten = (obj: any, prefix = "") => {
    if (obj === null || obj === undefined) return;

    if (Array.isArray(obj)) {
      obj.forEach((val, i) => {
        flatten(val, prefix ? `${prefix}[${i}]` : `[${i}]`);
      });
    } else if (typeof obj === "object" && !(obj instanceof Date)) {
      Object.entries(obj).forEach(([key, val]) => {
        flatten(val, prefix ? `${prefix}[${key}]` : key);
      });
    } else {
      searchParams.set(prefix, String(obj));
    }
  };

  flatten(params);
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

