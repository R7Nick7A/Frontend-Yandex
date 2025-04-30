import { EventEmitter } from './components/base/events';
import { AppState, Product, CartItem, DeliveryInfo, ContactInfo } from './types';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Modal } from './components/Modal';
import { Order } from './components/Order';
import { SuccessModal } from './components/SuccessModal';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Api } from './components/base/api';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { OrderModel } from './components/models/OrderModel';
import { ApiListResponse } from './types';

export class App {
  private events: EventEmitter;
  private state: AppState;
  private api: Api;
  private catalogModel: CatalogModel;
  private cartModel: CartModel;
  private orderModel: OrderModel;
  private components: {
    card: ProductCard;
    cart: Cart;
    modal: Modal;
    order: Order;
    success: SuccessModal;
  };

  constructor() {
    this.events = new EventEmitter();
    this.api = new Api(API_URL);
    this.catalogModel = new CatalogModel(this.events);
    this.cartModel = new CartModel(this.events);
    this.orderModel = new OrderModel(this.events);
    
    this.state = {
      catalog: [],
      cart: {
        items: [],
        total: 0
      },
      checkout: {
        currentStep: 'cart',
        delivery: {},
        contacts: {}
      },
      loading: false,
      error: null
    };

    this.initComponents();
    this.initEventListeners();
    
    const app = document.getElementById('app');
    if (app) {
      app.append(this.render());
    }
    
    this.loadProducts();
  }

  private initComponents() {
    this.components = {
      card: new ProductCard(ensureElement<HTMLElement>('#card-catalog'), this.events),
      cart: new Cart(ensureElement<HTMLElement>('#basket'), this.events),
      modal: new Modal(ensureElement<HTMLElement>('#modal-container'), this.events),
      order: new Order(ensureElement<HTMLElement>('#order'), this.events),
      success: new SuccessModal(ensureElement<HTMLElement>('#success'), this.events)
    };
  }

  private initEventListeners() {
    this.events.on('catalog:changed', (data: { items: Product[] }) => {
      this.state.catalog = data.items;
      this.renderCatalog();
    });

    this.events.on('cart:changed', (data: { items: CartItem[], total: number }) => {
      this.state.cart = data;
      this.components.cart.render(data);
    });

    this.events.on('order:submit', (data: DeliveryInfo) => {
      this.state.checkout.delivery = data;
      this.state.checkout.currentStep = 'contacts';
      this.components.order.render({
        payment: data.paymentMethod,
        address: data.address
      });
    });

    this.events.on('order:success', (data: { total: number }) => {
      this.components.success.render(data);
      this.components.modal.open();
    });

    this.events.on('success:close', () => {
      this.components.modal.close();
      this.cartModel.clear();
      this.orderModel.reset();
    });
  }

  private async loadProducts() {
    try {
      this.catalogModel.setLoading(true);
      const response = await this.api.get('/products') as ApiListResponse<Product>;
      this.catalogModel.setCatalog(response.items);
    } catch (error) {
      this.catalogModel.setError('Ошибка при загрузке товаров');
    } finally {
      this.catalogModel.setLoading(false);
    }
  }

  private renderCatalog() {
    const catalog = ensureElement<HTMLElement>('#catalog');
    catalog.innerHTML = '';
    this.state.catalog.forEach(item => {
      const card = new ProductCard(cloneTemplate('#card-catalog'), this.events);
      card.render(item);
      catalog.appendChild(card.render(item));
    });
  }

  private render(): HTMLElement {
    const app = document.createElement('div');
    app.id = 'app';
    app.innerHTML = `
      <header class="header">
        <div class="header__container">
          <a class="header__logo" href="/">
            <img src="/images/logo.svg" alt="Логотип" />
          </a>
          <div class="header__cart">
            <button class="header__cart-button" id="basket">
              <span class="header__cart-count">0</span>
            </button>
          </div>
        </div>
      </header>
      <main class="main">
        <div class="container">
          <div class="catalog" id="catalog"></div>
        </div>
      </main>
      <div id="modal-container"></div>
      <div id="success"></div>
    `;
    return app;
  }
} 