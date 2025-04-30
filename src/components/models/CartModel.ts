import { Model } from '../base/Model';
import { CartItem, CartState } from '../../types';
import { IEvents } from '../base/events';

export class CartModel extends Model<CartState> {
    protected items: CartItem[] = [];
    protected total: number = 0;

    constructor(events: IEvents) {
        super({
            items: [],
            total: 0
        }, events);
    }

    addItem(item: CartItem) {
        if (!this.items.find(i => i.id === item.id)) {
            this.items.push(item);
            this.updateTotal();
            this.emitChanges('cart:changed', { items: this.items, total: this.total });
        }
    }

    removeItem(id: string) {
        this.items = this.items.filter(item => item.id !== id);
        this.updateTotal();
        this.emitChanges('cart:changed', { items: this.items, total: this.total });
    }

    clear() {
        this.items = [];
        this.total = 0;
        this.emitChanges('cart:changed', { items: this.items, total: this.total });
    }

    private updateTotal() {
        this.total = this.items.reduce((sum, item) => sum + item.price, 0);
    }

    getItems(): CartItem[] {
        return this.items;
    }

    getTotal(): number {
        return this.total;
    }
} 