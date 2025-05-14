import './scss/styles.scss';
import { cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { DataApi } from './components/DataApi';
import { CartModel } from './components/CartModel';
import { OrderModel } from './components/OrderModel';
import { IEventData, IItem, IOrder } from './types';
import { ItemView } from './components/ItemView';
import { ModalView } from './components/ModalView';
import { CartView } from './components/CartView';
import { OrderFormView, ContactsFormView } from './components/FormView';
import { SuccessWindowView } from './components/SuccessWindowView';

// ТЕМПЛЕЙТЫ
const templateGalleryCard = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const contactsFormTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const orderFormTemplate = document.querySelector('#order') as HTMLTemplateElement;
const windowSuccessTemplate = document.querySelector('#success') as HTMLTemplateElement;
const templateCartCard = document.querySelector('#card-basket') as HTMLTemplateElement;

// ЭКЗЕМПЛЯРЫ КЛАССОВ
// один экземпляр EventEmitter
const events = new EventEmitter();

// один экземпляр корзины (модель, данные)
const cartData = new CartModel(events);

// один экземпляр корзины (вью)
const cartView = new CartView(cloneTemplate(cartTemplate), events);

// один экземпляр заказа (модель, данные)
const orderData = new OrderModel();

// один экземпляр модального окна (вью)
const modalView = ModalView.getInstance(events);

// один экземпляр формы заказа
const orderForm = new OrderFormView(cloneTemplate(orderFormTemplate), events);

// один экземпляр формы контактов
const contactsForm = new ContactsFormView(
	cloneTemplate(contactsFormTemplate),
	events
);

// один экземпляр окна успешного заказа
const successWindow = new SuccessWindowView(
	cloneTemplate(windowSuccessTemplate),
	events
);

// инициализация карточек на странице
const gallery = document.querySelector('.gallery') as HTMLElement;
// server API
const items = new DataApi(API_URL);
let cards: ItemView[] = [];
items.getItems()
	.then((data) => {
		cards = data.items.map((item: IItem) => {
			item.image = CDN_URL + item.image;
			const card = new ItemView(cloneTemplate(templateGalleryCard), events, item);
			gallery.prepend(card.render());
			return card;
		});
		return cards
	})
		.catch ((err) => {
			console.log('Произошла ошибка:', err);
	});

// ПОДПИСКА НА СОБЫТИЯ

// вью генерирует событие открытия модалки -> модалка открывается
events.on<IEventData>('modal:open', (item) => {
	modalView.openModal(item.element as HTMLElement);
});

// вью генерирует событие зарытия модалки -> модалка закрывается
events.on<IEventData>('modal:close', () => {
	modalView.closeModal();
});

// вью генерирует событие удаления товара из корзины -> модель корзины (данные) удаляет у себя товар и генерит cart:change
// можно объединить со следующим и передавать в параметрах плюс или минус в зависимости от того, нужно ли удалять или добавлять
events.on<IEventData>('cart:remove', (item) => {
	cartData.remove(item.data);
});

// вью генерирует событие добавления товара в корзину -> модель корзины (данные) добавляет к себе товар и генерит cart:change
events.on<IEventData>('cart:add', (item) => {
	cartData.add(item.data);
});

// модель корзины сгенерировала событие, что она изменилась -> представление корзины отреагировало (корзина добавила все товары)
events.on<{ items: string[] }>('cart:changed', (data) => {
	cartView.clear();
	cards.forEach((item) => {
		data.items.forEach((dataItem) => {
			if (item.data.id === dataItem) {
				cartView.addItem(
					item.getCartItemView(cloneTemplate(templateCartCard)),
					item.data.id,
					cartData.total
				);
			}
		});
	});
});

// вью генерирует событие сабмита формы -> модель корзины (данные) сохраняет ID купленных товаров, после чего открывается модалка с формой контактов
events.on<[id: string]>('cart:submit', (data) => {
	orderData.items = data;
	orderData.total = cartData.total;
	modalView.openModal(orderForm.render());
});

// форма заказа генерит событие
events.on<Partial<IOrder>>('orderData:changed', (data) => {
	orderData.address = data.address;
	orderData.payment = data.payment;
	modalView.openModal(contactsForm.render());
});

// форма контактов генерит событие
events.on<Partial<IOrder>>('orderData:finished', (data) => {
	orderData.phone = data.phone;
	orderData.email = data.email;
	items
		.sendOrder(orderData.customerFullInfo)
		.then(() => {
			modalView.openModal(successWindow.render(orderData.total));
			cartView.clear();
			cartData.clear();
		})
		.catch((err) => {
			console.log('Произошла ошибка:', err);
		});
});
