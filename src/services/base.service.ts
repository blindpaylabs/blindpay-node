import { ErrorResponse } from "../types/error-response";

export abstract class BaseService {
  protected abstract endpoint: string;

  constructor(
    protected readonly baseUrl: string,
    protected readonly headers: Headers
  ) {}

  protected async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<{ data: T | null; error: ErrorResponse | null }> {
    const requestOptions: RequestInit = {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      const response = await fetch(
        `${this.baseUrl}${this.endpoint}${path}`,
        requestOptions
      );

      if (!response.ok) {
        const rawError = await response.text();
        return { data: null, error: JSON.parse(rawError) as ErrorResponse };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          name: "application_error",
          message: "Unable to fetch data. The request could not be resolved.",
        },
      };
    }
  }

  async get<T>(path: string) {
    return this.request<T>("GET", path);
  }

  async post<T>(path: string, body: unknown) {
    return this.request<T>("POST", path, body);
  }

  async put<T>(path: string, body: unknown) {
    return this.request<T>("PUT", path, body);
  }

  async patch<T>(path: string, body: unknown) {
    return this.request<T>("PATCH", path, body);
  }

  async delete<T>(path: string) {
    return this.request<T>("DELETE", path);
  }
}
