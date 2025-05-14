import { ICartModel, IEventEmitter, IItem, IOrder } from "../types";

export class CartModel implements ICartModel {
  protected _items: Map<string, number> = new Map();
  protected _total: number = 0;
  protected _order: IOrder;

  constructor(protected events: IEventEmitter) {}

  add(data: Partial<IItem>): void {
    if(!this.items.has(data.id)) {
      this.items.set(data.id, 0);
      this.items.set(data.id, this.items.get(data.id)! + 1);
      this._total += Number(data.price);
      this._changed();
    } else return
  }

  remove(data: Partial<IItem>): void {    
    if(!this.items.has(data.id)) return
    if(this.items.get(data.id)! > 0) {
      this.items.set(data.id, this.items.get(data.id)! - 1);
      if(this.items.get(data.id) === 0) this.items.delete(data.id);
      this.total -= Number(data.price);
      this._changed();
    }
  }

  get items() {
    return this._items
  }

  protected set items(data: Map<string, number>) {
    this._items = data;
  }

  protected set total(value: number) {
    this._total = value;
  }

  get total() {
    return this._total;
  }

  clear(): void {
    this.items = new Map();
    this.total = 0;
  }

  protected _changed() {
    this.events.emit('cart:changed', {items: Array.from(this.items.keys()), sum: this.total});
  }
}