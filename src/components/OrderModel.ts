import { IOrder, IOrderModel, PaymentType } from "../types";

export class OrderModel implements IOrderModel {
  protected _payment: PaymentType | null = null;
  protected _address: string = '';
  protected _email: string = '';
  protected _phone: string = '';
  protected _customerFullInfo: IOrder | null = null;
  protected _items: string[] = [];
  protected _total: number = 0;

  constructor() {
    this._customerFullInfo = {
      payment: this._payment,
      address: this._address,
      email: this._email,
      phone: this._phone,
      items: this._items,
      total: this._total,
    }
  }

  set payment(paymentType: PaymentType) {
    this._payment = paymentType;
    this._customerFullInfo.payment = paymentType;
  }

  get payment(): PaymentType {
    return this._payment;
  }

  set address(address: string) {
    this._address = address;
    this._customerFullInfo.address = address;
  }

  get address(): string {
    return this._address;
  }

  set email(email: string) {
    this._email = email;
    this._customerFullInfo.email = email;
  }

  get email(): string {
    return this._email;
  }

  set phone(phone: string) {
    this._phone = phone;
    this._customerFullInfo.phone = phone;
  }

  get phone(): string {
    return this._phone;
  }

  set items(items: string[]) {
    this._items = items;
    this.customerFullInfo.items = items;
  }

  get items() {
    return this._items;
  }

  set total (total: number) {
    this._total = total;
    this.customerFullInfo.total = total;
  }

  get total() {
    return this._total;
  }

  get customerFullInfo(): IOrder {
    return this._customerFullInfo;
  }

}