const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const DEFAULT_REVALIDATE_SECONDS = Number(process.env.STRAPI_REVALIDATE_SECONDS || 600);
const STRAPI_BASE_URL = STRAPI_URL.replace(/\/$/, "");
const USE_AUTH_HEADER = STRAPI_TOKEN
  && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(STRAPI_BASE_URL);

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
  options?: RequestInit & { revalidate?: number; tags?: string[]; silent?: boolean }
): Promise<StrapiResponse<T>> {
  const {
    revalidate = DEFAULT_REVALIDATE_SECONDS,
    tags = [],
    silent = false,
    cache = "force-cache",
    ...fetchOptions
  } = options || {};

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions?.headers,
  };

  // Add authorization header if token is available
  if (USE_AUTH_HEADER) {
    (headers as Record<string, string>)["Authorization"] =
      `Bearer ${STRAPI_TOKEN}`;
  }

  // Normalize URL to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${STRAPI_BASE_URL}/api${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers,
      cache,
      next: {
        revalidate,
        ...(tags.length ? { tags } : {}),
      },
    });

    // console.log(`[Strapi] ${endpoint} - Status: ${res.status}`);

    if (!res.ok) {
      const errorText = await res.text();
      if (!silent) {
        console.error(`[Strapi] Error fetching ${endpoint}:`, {
          status: res.status,
          statusText: res.statusText,
          url,
          response: errorText
        });
      }

      let errorMessage = `Failed to fetch ${endpoint} (${res.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {
        // errorText is not JSON
      }

      throw new Error(errorMessage);
    }

    const json = await res.json();
    return transformMediaUrls(json);
  } catch (error) {
    if (!silent) {
      console.error(`[Strapi] Exception fetching ${endpoint}:`, error);
    }
    throw error;
  }
}

/**
 * Recursively transform relative Strapi URLs to absolute ones
 */
type StrapiQueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | StrapiQueryObject
  | StrapiQueryValue[];

type StrapiQueryObject = {
  [key: string]: StrapiQueryValue;
};

type MediaTransformValue =
  | string
  | number
  | boolean
  | null
  | MediaTransformObject
  | MediaTransformValue[];

type MediaTransformObject = {
  [key: string]: MediaTransformValue;
};

function transformMediaUrls<T>(data: T): T {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map((item) => transformMediaUrls(item)) as T;
  }

  if (typeof data === "object") {
    const newData: MediaTransformObject = { ...(data as MediaTransformObject) };

    for (const key in newData) {
      if (
        key === "url" &&
        typeof newData[key] === "string" &&
        newData[key].startsWith("/")
      ) {
        newData[key] = `${STRAPI_BASE_URL}${newData[key]}`;
      } else {
        newData[key] = transformMediaUrls(newData[key]);
      }
    }
    return newData as T;
  }

  return data;
}

/**
 * Build Strapi query string from parameters (Standard Bracket Notation)
 */
export function buildStrapiQuery(params: StrapiQueryObject): string {
  const searchParams = new URLSearchParams();

  const flatten = (obj: StrapiQueryValue, prefix = "") => {
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
