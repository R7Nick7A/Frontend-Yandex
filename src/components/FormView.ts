import { IEventEmitter } from "../types";
import { View } from "./base/view";

abstract class BaseFormView extends View {
  protected element: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected inputs: Array<{ input: HTMLInputElement, errorElement: HTMLSpanElement, errorMessage: string }>;

  constructor(element: HTMLElement, events: IEventEmitter) {
    super(element, events);
    this.submitButton = this.element.querySelector('.submit-button') as HTMLButtonElement;
    this.inputs = [];
  }

  protected checkSubmitButtonState() {
    const allValid = this.inputs.every(({ input }) => input.validity.valid);
    this.submitButton.disabled = !(allValid && this.additionalConditions());
  }

  protected checkIfValidated(input: HTMLInputElement, errorElement: HTMLSpanElement, errorMessage: string): boolean {
    if (!input.validity.valid) {
      errorElement.textContent = errorMessage;
      return false;
    } else {
      errorElement.textContent = '';
      return true;
    }
  }

  protected setupInputValidation(input: HTMLInputElement, errorElement: HTMLSpanElement, errorMessage: string) {
    this.inputs.push({ input, errorElement, errorMessage });

    input.addEventListener('input', () => {
      if (this.checkIfValidated(input, errorElement, errorMessage)) {
        this.checkSubmitButtonState();
      } else {
        this.submitButton.disabled = true;
      }
    });
  }

  protected additionalConditions(): boolean {
    return true;
  }
}

export class OrderFormView extends BaseFormView {
  protected paymentCashButton: HTMLButtonElement;
  protected paymentCardButton: HTMLButtonElement;
  protected adressInput: HTMLInputElement;
  protected adressInputError: HTMLSpanElement;
  protected payment: string | undefined;
  protected address: string;

  constructor(element: HTMLElement, events: IEventEmitter) {
    super(element, events);

    this.paymentCardButton = this.element.querySelector('#buttonCard') as HTMLButtonElement;
    this.paymentCashButton = this.element.querySelector('#buttonCash') as HTMLButtonElement;
    this.adressInput = this.element.elements.namedItem('address') as HTMLInputElement;
    this.adressInputError = this.element.querySelector('.form__error-address') as HTMLSpanElement;

    this.setupInputValidation(this.adressInput, this.adressInputError, 'Адрес не может быть короче 5 символов');
    
    this.submitButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.events.emit('orderData:changed', { payment: this.payment, address: this.adressInput.value });
    });

    this.paymentCashButton.addEventListener('click', () => {
      this.paymentCardButton.classList.remove('button_alt-active');
      this.paymentCashButton.classList.add('button_alt-active');
      this.payment = this.paymentCashButton.dataset.payment;
      this.checkSubmitButtonState();
    });

    this.paymentCardButton.addEventListener('click', () => {
      this.paymentCashButton.classList.remove('button_alt-active');
      this.paymentCardButton.classList.add('button_alt-active');
      this.payment = this.paymentCardButton.dataset.payment;
      this.checkSubmitButtonState();
    });
  }

  protected additionalConditions(): boolean {
    return !!this.payment && !!this.adressInput.value;
  }
}

export class ContactsFormView extends BaseFormView {
  protected emailInput: HTMLInputElement;
  protected emailInputError: HTMLSpanElement;
  protected phoneInput: HTMLInputElement;
  protected phoneInputError: HTMLSpanElement;
  protected email: string;
  protected phoneNumber: string;

  constructor(element: HTMLElement, events: IEventEmitter) {
    super(element, events);
    this.emailInput = this.element.elements.namedItem('email') as HTMLInputElement;
    this.phoneInput = this.element.elements.namedItem('phone') as HTMLInputElement;
    this.emailInputError = this.element.querySelector('.form__error-email') as HTMLSpanElement;
    this.phoneInputError = this.element.querySelector('.form__error-phone') as HTMLSpanElement;

    this.setupInputValidation(this.emailInput, this.emailInputError, 'Некорректный email');
    this.setupInputValidation(this.phoneInput, this.phoneInputError, 'Введите телефон в формате 89...');

    this.submitButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.events.emit('orderData:finished', { email: this.emailInput.value, phone: this.phoneInput.value });
    });
  }

  protected additionalConditions(): boolean {
    return !!this.emailInput.value && !!this.phoneInput.value;
  }
}
