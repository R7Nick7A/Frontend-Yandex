import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface IOrderForm {
    address: string;
    payment: string;
    total: number;
}

interface IOrderActions {
    onSubmit: (event: MouseEvent) => void;
}

export class OrderForm extends Component<IOrderForm> {
    protected _form: HTMLFormElement;
    protected _address: HTMLInputElement;
    protected _payment: HTMLInputElement;
    protected _button: HTMLButtonElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, actions?: IOrderActions) {
        super(container);

        this._form = ensureElement<HTMLFormElement>('form', container);
        this._address = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this._payment = ensureElement<HTMLInputElement>('input[name="payment"]', container);
        this._button = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._total = ensureElement<HTMLElement>('.order__total', container);

        if (actions?.onSubmit) {
            this._form.addEventListener('submit', actions.onSubmit);
        }

        this._address.addEventListener('input', () => this.validate());
        this._payment.addEventListener('change', () => this.validate());
    }

    validate(): boolean {
        const isValid = this._address.value.trim() !== '' && this._payment.value !== '';
        this._button.disabled = !isValid;
        return isValid;
    }

    set total(value: number) {
        this.setText(this._total, `${value} ₽`);
    }

    get address(): string {
        return this._address.value;
    }

    get payment(): string {
        return this._payment.value;
    }

    render(data?: Partial<IOrderForm>): HTMLElement {
        if (data) {
            if (data.address) this._address.value = data.address;
            if (data.payment) this._payment.value = data.payment;
            if (data.total) this.total = data.total;
        }
        this.validate();
        return this.container;
    }
} 