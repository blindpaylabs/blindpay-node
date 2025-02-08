export interface BankDetail {
  label: string;
  regex: string;
  key: string;
  required: boolean;
  items?: Array<{ label: string; value: string }>;
}
