export interface Receiver {
  id: string;
  instance_id: string;
  name: string;
  type: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReceiverIn {
  name: string;
  type: string;
  country: string;
}

export interface UpdateReceiverAddressIn {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  postal_code: string;
  state_province_region: string;
  country: string;
}

export interface UpdateReceiverProfileIn {
  name: string;
  type: string;
}
