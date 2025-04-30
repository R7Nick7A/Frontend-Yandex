import { Component } from './base/Component';
import { Product } from '../types';
import { ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class ProductCard extends Component<Product> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._title = ensureElement<HTMLElement>('.card__title', this.container);
    this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
    this._category = ensureElement<HTMLElement>('.card__category', this.container);
    this._price = ensureElement<HTMLElement>('.card__price', this.container);
    this._button = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('card:select', { id: this.id });
      });
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set image(value: string) {
    this.setImage(this._image, value);
  }

  set category(value: string) {
    this.setText(this._category, value);
    this._category.className = `card__category card__category_${value}`;
  }

  set price(value: number | null) {
    if (value === null) {
      this.setText(this._price, 'Бесценно');
      this.setDisabled(this._button, true);
    } else {
      this.setText(this._price, `${value} синапсов`);
      this.setDisabled(this._button, false);
    }
  }

  set selected(value: boolean) {
    if (!this._button.disabled) {
      this._button.classList.toggle('button_alt-active', value);
    }
  }

  render(data?: Partial<Product>): HTMLElement {
    if (data) {
      this.id = data.id || '';
      this.title = data.title || '';
      this.image = data.image || '';
      this.category = data.category || '';
      this.price = data.price;
    }
    return this.container;
  }
} 