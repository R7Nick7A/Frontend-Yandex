import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { Product } from '../types';

interface IProductDetailsActions {
    onClick: (event: MouseEvent) => void;
}

export class ProductDetails extends Component<Product> {
    protected _title: HTMLElement;
    protected _description: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IProductDetailsActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set image(value: string) {
        this.setImage(this._image, value);
    }

    set category(value: string) {
        this.setText(this._category, value);
    }

    set price(value: number) {
        this.setText(this._price, `${value} ₽`);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    render(data?: Product): HTMLElement {
        if (data) {
            this.title = data.title;
            this.description = data.description;
            this.image = data.image;
            this.category = data.category;
            this.price = data.price;
        }
        return this.container;
    }
} 