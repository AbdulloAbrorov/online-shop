export interface ShippingInfo{
  fullName: string;
  address: string;
  city: string;
  numberPhone: string;
};

export interface CreateOrderPayload{
  shipping: ShippingInfo;
};