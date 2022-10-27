export interface Cart{
    items: CartItem[];
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  quantity: number;
}
