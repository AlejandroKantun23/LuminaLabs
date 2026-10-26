export interface Product {
  id: string;
  barcode: string;
  name: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  ticketNumber: string;
  date: string;
  time: string;
  total: number;
  paymentMethod: string;
  itemCount: number;
}