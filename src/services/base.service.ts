import { ErrorResponse } from "../types/error-response";

export abstract class BaseService {
  protected abstract BASE_PATH: string;

  constructor(
    protected readonly baseUrl: string,
    protected readonly headers: Headers,
    protected readonly instanceId?: string
  ) {}

  protected replaceParams(
    path: string,
    params: Record<string, string>
  ): string {
    let result = path;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`{${key}}`, value);
    });
    return result;
  }

  protected validateInstanceId(instanceId: string): void {
    const instance = instanceId || this.instanceId || "";
    if (!instance || instance.length !== 15) {
      throw new Error("Instance ID must be exactly 15 characters long");
    }
    if (!instance.startsWith("in_")) {
      throw new Error("Instance ID must start with 'in_'");
    }
  }

  protected replaceInstanceId(path: string, instanceId?: string): string {
    const in_id = this.instanceId || instanceId || "";
    if (!in_id) {
      throw new Error("Missing instanceId");
    }
    return path.replace("{instance_id}", in_id);
  }

  private async request<T>(
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
      const response = await fetch(`${this.baseUrl}${path}`, requestOptions);

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

  protected async _get<T>(path: string, queryParams?: Record<string, string>) {
    const queryString = queryParams
      ? `?${new URLSearchParams(queryParams).toString()}`
      : "";
    return this.request<T>("GET", `${path}${queryString}`);
  }

  protected async _post<T>(path: string, body: unknown) {
    return this.request<T>("POST", path, body);
  }

  protected async _put<T>(path: string, body: unknown) {
    return this.request<T>("PUT", path, body);
  }

  protected async _patch<T>(path: string, body: unknown) {
    return this.request<T>("PATCH", path, body);
  }

  protected async _delete<T>(path: string) {
    return this.request<T>("DELETE", path);
  }
}
