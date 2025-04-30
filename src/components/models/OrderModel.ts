import { Model } from '../base/Model';
import { DeliveryInfo, ContactInfo } from '../../types';
import { IEvents } from '../base/events';

interface IOrderModel {
    delivery: DeliveryInfo;
    contacts: ContactInfo;
    isValid: boolean;
}

export class OrderModel extends Model<IOrderModel> {
    protected _delivery: DeliveryInfo;
    protected _contacts: ContactInfo;
    protected _isValid: boolean;

    constructor(events: IEvents) {
        super({
            delivery: {
                address: '',
                paymentMethod: 'online'
            },
            contacts: {
                email: '',
                phone: ''
            },
            isValid: false
        }, events);

        this._delivery = {
            address: '',
            paymentMethod: 'online'
        };
        this._contacts = {
            email: '',
            phone: ''
        };
        this._isValid = false;
    }

    setDelivery(delivery: DeliveryInfo) {
        this._delivery = delivery;
        this.validateDelivery();
        this.emitChanges('order:delivery', this._delivery);
    }

    setContacts(contacts: ContactInfo) {
        this._contacts = contacts;
        this.validateContacts();
        this.emitChanges('order:contacts', this._contacts);
    }

    getDelivery(): DeliveryInfo {
        return this._delivery;
    }

    getContacts(): ContactInfo {
        return this._contacts;
    }

    get isValid(): boolean {
        return this._isValid;
    }

    private validateDelivery(): void {
        this._isValid = Boolean(this._delivery.address && this._delivery.paymentMethod);
        this.emitChanges('order:valid', { isValid: this._isValid });
    }

    private validateContacts(): void {
        this._isValid = Boolean(this._contacts.email && this._contacts.phone);
        this.emitChanges('order:valid', { isValid: this._isValid });
    }

    reset(): void {
        this._delivery = {
            address: '',
            paymentMethod: 'online'
        };
        this._contacts = {
            email: '',
            phone: ''
        };
        this._isValid = false;
        this.emitChanges('order:reset');
    }
} 