# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом (Component, Model, events, api)

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание проекта  
**Онлайн-магазин** цифровых товаров для разработчиков 
Содержание:
- 📦 Каталог товаров с модальными окнами  
- 🛒 Корзина с пошаговым оформлением  
- 📝 3 этапа заказа: доставка → контакты → подтверждение  

## Архитектура (типы данных)
**Основные сущности:**

```
type Product = {
  id: string;
  title: string;
  price: number | null;
  category: 'софт-скил' | 'хард-скил' | 'другое';
};

type CartItem = {
  index: number;  // Порядковый номер
  title: string;  // Название
  price: number;  // Цена (обязательно число)
};

**Состояние приложения:**

```
type AppState = {
  catalog: Product[];  // Все товары
  cart: {
    items: CartItem[]; // Товары в корзине
    total: number;     // Итоговая сумма
  };
  checkout: {
    currentStep: 'cart' | 'delivery' | 'contacts' | 'success';
    address: string;      // Этап доставки
    paymentMethod: 'online' | 'offline';
    email: string;       // Этап контактов
    phone: string;
  };
};

**Дополнительные сущности:**

```
type DeliveryInfo = {
  address: string;
  paymentMethod: 'online' | 'offline';
};

type ContactInfo = {
  email: string;
  phone: string;
};

type IEvents = {
  on<T>(event: string, callback: (data: T) => void): void;
  emit<T>(event: string, data?: T): void;
  off(event: string, callback: Function): void;
};

type IProduct = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number | null;
  category: 'софт-скил' | 'хард-скил' | 'другое';
};

type IOrder = {
  payment: 'online' | 'offline';
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[];
};

type IOrderResult = {
  id: string;
  total: number;
};

**Интерфейсы компонентов:**

```
interface IComponent {
  render(): HTMLElement;
  setState(data: Partial<T>): void;
}

interface IModal {
  open(): void;
  close(): void;
  setContent(content: HTMLElement): void;
}

interface ICart {
  addItem(item: CartItem): void;
  removeItem(id: string): void;
  clear(): void;
  getTotal(): number;
}

interface IOrderForm {
  setAddress(address: string): void;
  setPayment(method: 'online' | 'offline'): void;
  setEmail(email: string): void;
  setPhone(phone: string): void;
  validate(): boolean;
  submit(): Promise<IOrderResult>;
}

**События приложения:**

```
type AppEvents = {
  'items:changed': CartItem[];
  'cart:open': void;
  'cart:close': void;
  'order:submit': IOrder;
  'order:success': IOrderResult;
  'modal:open': void;
  'modal:close': void;
  'product:select': IProduct;
};
```

## UML-диаграмма классов

```mermaid
classDiagram
    class Component {
        #container: HTMLElement
        #containerSelector: string
        +render(data?: T): HTMLElement
        #initialize(): void
        #setText(element: HTMLElement, value: string): void
        #setDisabled(element: HTMLElement, state: boolean): void
        #setImage(element: HTMLImageElement, src: string, alt?: string): void
    }

    class Model {
        #events: IEvents
        +constructor(data: Partial<T>, events: IEvents)
        #emitChanges(eventName: string, payload?: Partial<T>): void
    }

    class EventEmitter {
        -events: { [key: string]: Function[] }
        +on<T>(event: string, callback: (data: T) => void): void
        +emit<T>(event: string, data?: T): void
        +off(event: string, callback: Function): void
        +trigger<T>(eventName: string, context?: Partial<T>): Function
    }

    class Api {
        -baseUrl: string
        +get<T>(endpoint: string): Promise<T>
        +post<T>(endpoint: string, data: object): Promise<T>
    }

    class CartModel {
        -items: CartItem[]
        -total: number
        +addItem(item: CartItem): void
        +removeItem(id: string): void
        +clear(): void
        +getItems(): CartItem[]
        +getTotal(): number
    }

    class OrderModel {
        -delivery: DeliveryInfo
        -contacts: ContactInfo
        -isValid: boolean
        +setDelivery(delivery: DeliveryInfo): void
        +setContacts(contacts: ContactInfo): void
        +getDelivery(): DeliveryInfo
        +getContacts(): ContactInfo
        +reset(): void
    }

    class ProductCard {
        -title: HTMLElement
        -image: HTMLImageElement
        -category: HTMLElement
        -price: HTMLElement
        -button: HTMLButtonElement
        +set id(value: string)
        +set title(value: string)
        +set image(value: string)
        +set category(value: string)
        +set price(value: number)
    }

    class Cart {
        -list: HTMLElement
        -total: HTMLElement
        -button: HTMLElement
        +set items(items: CartItem[])
        +set total(total: number)
        +set selected(items: string[])
    }

    class Modal {
        -closeButton: HTMLButtonElement
        -content: HTMLElement
        +set content(value: HTMLElement)
        +open(): void
        +close(): void
    }

    class Order {
        -button: HTMLElement
        -form: HTMLElement
        -payment: HTMLButtonElement[]
        -address: HTMLInputElement
        -email: HTMLInputElement
        -phone: HTMLInputElement
        +set address(value: string)
        +set payment(value: string)
        +set email(value: string)
        +set phone(value: string)
    }

    Component <|-- ProductCard
    Component <|-- Cart
    Component <|-- Modal
    Component <|-- Order
    Model <|-- CartModel
    Model <|-- OrderModel
    EventEmitter --> Model
    Api --> CartModel
    Api --> OrderModel
```

## Взаимодействие компонентов

1. **Инициализация приложения**
   - Создание экземпляра App
   - Инициализация базовых компонентов
   - Загрузка каталога товаров

2. **Работа с каталогом**
   - Отображение товаров через ProductCard
   - Добавление в корзину через CartModel
   - Обновление состояния через EventEmitter

3. **Работа с корзиной**
   - Управление товарами через CartModel
   - Отображение через Cart
   - Оформление заказа через OrderModel

4. **Оформление заказа**
   - Валидация данных через OrderModel
   - Отображение форм через Order
   - Отправка заказа через Api

5. **Модальные окна**
   - Управление через Modal
   - Отображение успешного заказа через SuccessModal


