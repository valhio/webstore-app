export interface Cart{
    items: CartItem[];
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  quantity: number;
}
