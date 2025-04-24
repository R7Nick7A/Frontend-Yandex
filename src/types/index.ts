// Базовые типы
type PaymentMethod = 'online' | 'offline';
type Category = 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое';

// Основные сущности
type Product = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: Category;
  price: number | null; 
};

type CartItem = {
  index: number;  
  id: string;     
  title: string;  
  price: number;  
};

// Модули состояния
type CartState = {
  items: CartItem[];
  total: number;
};

type DeliveryInfo = {
  address: string;
  paymentMethod: PaymentMethod;
};

type ContactInfo = {
  email: string;
  phone: string;
};

// Процесс оформления заказа
type CheckoutProcess = {
  currentStep: 'cart' | 'delivery' | 'contacts' | 'success';
  delivery: Partial<DeliveryInfo>; // Partial для незаполненных полей
  contacts: Partial<ContactInfo>;
};

// API взаимодействие
type OrderRequest = {
  items: string[];  // IDs товаров
  total: number;
  address: string;
  payment: PaymentMethod;
  email: string;
  phone: string;
};

type OrderResponse = {
  id: string;
  total: number;
};

// Глобальное состояние
type AppState = {
  catalog: Product[];
  cart: CartState;
  checkout: CheckoutProcess;
  loading: boolean;
  error: string | null;
};