// Базовые типы
export type PaymentMethod = 'online' | 'offline';
export type Category = 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое';

// Основные сущности
export type Product = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: Category;
  price: number | null;
  onClick?: (event: MouseEvent) => void;
};

export type CartItem = {
  index: number;  
  id: string;     
  title: string;  
  price: number;  
};

// Модули состояния
export type CartState = {
  items: CartItem[];
  total: number;
};

export type DeliveryInfo = {
  address: string;
  paymentMethod: PaymentMethod;
};

export type ContactInfo = {
  email: string;
  phone: string;
};

// Процесс оформления заказа
export type CheckoutProcess = {
  currentStep: 'cart' | 'delivery' | 'contacts' | 'success';
  delivery: Partial<DeliveryInfo>; // Partial для незаполненных полей
  contacts: Partial<ContactInfo>;
};

// API взаимодействие
export type OrderRequest = {
  items: string[];  // IDs товаров
  total: number;
  address: string;
  payment: PaymentMethod;
  email: string;
  phone: string;
};

export type OrderResponse = {
  id: string;
  total: number;
};

// Глобальное состояние
export type AppState = {
  catalog: Product[];
  cart: CartState;
  checkout: CheckoutProcess;
  loading: boolean;
  error: string | null;
};

export interface IEvents {
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
}

export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
};