import { Generated } from "./generated";

export interface Instance {
  id: string;
  name: string;
  type: string;
  onboarding_step: string;
  created_at: Generated<string>;
  updated_at: Generated<string>;
  deleted_at: string | null;
}
