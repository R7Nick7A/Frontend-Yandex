import { Component } from './base/Component';
import { CartItem, CartState } from '../types';
import { createElement, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

interface ICartActions {
    onClick: (event: MouseEvent) => void;
}

export class Cart extends Component<CartState> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container);
        this._button = ensureElement<HTMLElement>('.basket__button', this.container);

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('cart:order');
            });
        }

        this.items = [];
    }

    set items(items: CartItem[]) {
        if (items.length) {
            this._list.replaceChildren(...items.map(item => {
                const element = createElement<HTMLElement>('li', {
                    className: 'basket__item',
                    innerHTML: `
                        <span class="basket__item-index">${item.index}</span>
                        <span class="basket__item-title">${item.title}</span>
                        <span class="basket__item-price">${item.price} синапсов</span>
                        <button class="basket__item-delete" aria-label="удалить"></button>
                    `
                });

                const deleteButton = element.querySelector('.basket__item-delete');
                if (deleteButton) {
                    deleteButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        this.events.emit('cart:remove', item);
                    });
                }

                return element;
            }));
        } else {
            this._list.replaceChildren(createElement<HTMLElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }
}
