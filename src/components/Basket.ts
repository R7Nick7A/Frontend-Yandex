import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { Product } from '../types';

interface IBasketActions {
    onClick: (event: MouseEvent) => void;
}

export class Basket extends Component<Product[]> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IBasketActions) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__total', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set items(items: Product[]) {
        this._list.innerHTML = '';
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'basket__item';
            itemElement.innerHTML = `
                <span class="basket__item-title">${item.title}</span>
                <span class="basket__item-price">${item.price} ₽</span>
            `;
            this._list.appendChild(itemElement);
        });
    }

    set total(value: number) {
        this.setText(this._total, `Итого: ${value} ₽`);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    render(data: Product[]): HTMLElement {
        if (data) {
            this.items = data;
            this.total = data.reduce((sum, item) => sum + item.price, 0);
        }
        return this.container;
    }
} 