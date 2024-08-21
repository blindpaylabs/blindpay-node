import { Generated } from "./generated";

export interface ApiKey {
  created_at: Generated<string>;
  deleted_at: string | null;
  id: string;
  instance_id: string;
  last_used_at: Generated<string>;
  name: string;
  permission: string;
  token: string;
  updated_at: Generated<string>;
}
