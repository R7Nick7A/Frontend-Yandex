import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface IDeliveryForm {
    address: string;
    payment: string;
}

interface IDeliveryFormActions {
    onSubmit: (event: MouseEvent) => void;
}

export class DeliveryForm extends Component<IDeliveryForm & IDeliveryFormActions> {
    protected _address: HTMLInputElement;
    protected _payment: HTMLInputElement;
    protected _button: HTMLButtonElement;

    constructor(containerSelector: string, actions?: IDeliveryFormActions) {
        super('#order', containerSelector);

        this._address = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this._payment = ensureElement<HTMLInputElement>('input[name="payment"]', this.container);
        this._button = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

        if (actions?.onSubmit) {
            this._button.addEventListener('click', actions.onSubmit);
        }
    }

    set address(value: string) {
        this._address.value = value;
    }

    set payment(value: string) {
        this._payment.value = value;
    }

    set disabled(value: boolean) {
        this.setDisabled(this._button, value);
    }

    render(data?: IDeliveryForm & IDeliveryFormActions): HTMLElement {
        if (data) {
            this.address = data.address;
            this.payment = data.payment;
        }
        return this.container;
    }
} 