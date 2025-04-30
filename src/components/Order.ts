import { Component } from './base/Component';
import { DeliveryInfo, ContactInfo } from '../types';
import { ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

interface IOrderActions {
    onClick: (event: MouseEvent) => void;
}

interface IOrderForm {
    payment: string;
    address: string;
}

interface IContactsForm {
    email: string;
    phone: string;
}

export class Order extends Component<IOrderForm & IContactsForm> {
    protected _button: HTMLElement;
    protected _form: HTMLElement;
    protected _payment: HTMLButtonElement[];
    protected _address: HTMLInputElement;
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._button = ensureElement<HTMLElement>('.order__button', this.container);
        this._form = ensureElement<HTMLElement>('.order__form', this.container);
        this._payment = Array.from(this.container.querySelectorAll('.payment__button'));
        this._address = ensureElement<HTMLInputElement>('.form__input_address', this.container);
        this._email = ensureElement<HTMLInputElement>('.form__input_email', this.container);
        this._phone = ensureElement<HTMLInputElement>('.form__input_phone', this.container);

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:submit', {
                    payment: this._payment.find(item => item.classList.contains('button_alt-active'))?.name,
                    address: this._address.value,
                    email: this._email.value,
                    phone: this._phone.value
                });
            });
        }

        this._payment.forEach(button => {
            button.addEventListener('click', () => {
                this._payment.forEach(item => item.classList.remove('button_alt-active'));
                button.classList.add('button_alt-active');
                this.onInputChange();
            });
        });

        this._address.addEventListener('input', () => this.onInputChange());
        this._email.addEventListener('input', () => this.onInputChange());
        this._phone.addEventListener('input', () => this.onInputChange());
    }

    protected onInputChange() {
        if (this._payment.some(item => item.classList.contains('button_alt-active')) &&
            this._address.value &&
            this._email.value &&
            this._phone.value) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    set address(value: string) {
        this._address.value = value;
    }

    set payment(value: string) {
        this._payment.forEach(button => {
            if (button.name === value) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    set email(value: string) {
        this._email.value = value;
    }

    set phone(value: string) {
        this._phone.value = value;
    }

    render(data?: Partial<IOrderForm & IContactsForm>): HTMLElement {
        if (data) {
            this.address = data.address || '';
            this.payment = data.payment || '';
            this.email = data.email || '';
            this.phone = data.phone || '';
        }
        return this.container;
    }
} 