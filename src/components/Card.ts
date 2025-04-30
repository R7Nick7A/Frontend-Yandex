import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { Product } from '../types';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<Product> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number) {
        this.setText(this._price, `${value} ₽`);
    }

    set category(value: string) {
        this.setText(this._category, value);
    }

    set image(value: string) {
        this.setImage(this._image, value);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    render(data?: Product): HTMLElement {
        if (data) {
            this.title = data.title;
            this.price = data.price;
            this.category = data.category;
            this.image = data.image;
        }
        return this.container;
    }
} 