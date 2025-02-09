import { Generated } from "./generated";

export interface ApiKey {
  id: string;
  name: string;
  permission: "full_access";
  token: string;
  ip_whitelist?: string[] | null;
  unkey_id?: string;
  last_used_at: Generated<string>;
  instance_id: string;
  created_at: Generated<string>;
  updated_at: Generated<string>;
  deleted_at: string | null;
}

export interface CreateApiKeyRequest {
  name: string;
  permission: "full_access";
  ip_whitelist?: string[] | null;
}

export interface CreateApiKeyResponse {
  id: string;
  token: string;
}

export interface DeleteApiKeyResponse {
  success: boolean;
}
