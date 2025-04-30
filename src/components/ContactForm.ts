import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface IContactForm {
    email: string;
    phone: string;
}

interface IContactFormActions {
    onSubmit: (event: MouseEvent) => void;
}

export class ContactForm extends Component<IContactForm> {
    protected _form: HTMLFormElement;
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;
    protected _button: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement, actions?: IContactFormActions) {
        super(container);

        this._form = ensureElement<HTMLFormElement>('.form__contacts', container);
        this._email = ensureElement<HTMLInputElement>('.form__input', container);
        this._phone = ensureElement<HTMLInputElement>('.form__input', container);
        this._button = ensureElement<HTMLButtonElement>('.form__button', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        this._email.addEventListener('input', () => this.validateForm());
        this._phone.addEventListener('input', () => this.validateForm());
        if (actions?.onSubmit) {
            this._form.addEventListener('submit', actions.onSubmit);
        }
    }

    private validateForm() {
        const emailValid = this.validateEmail(this._email.value);
        const phoneValid = this.validatePhone(this._phone.value);
        
        this._button.disabled = !(emailValid && phoneValid);
        
        if (!emailValid || !phoneValid) {
            this._errors.textContent = 'Пожалуйста, заполните все поля корректно';
        } else {
            this._errors.textContent = '';
        }
    }

    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private validatePhone(phone: string): boolean {
        const phoneRegex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
        return phoneRegex.test(phone);
    }

    set email(value: string) {
        this._email.value = value;
        this.validateForm();
    }

    set phone(value: string) {
        this._phone.value = value;
        this.validateForm();
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    render(data?: IContactForm): HTMLElement {
        if (data) {
            this.email = data.email;
            this.phone = data.phone;
        }
        return this.container;
    }
} 