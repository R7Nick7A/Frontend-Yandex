import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class SuccessModal extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (this._close) {
            this._close.addEventListener('click', () => {
                this.events.emit('success:close');
            });
        }
    }

    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }

    render(data?: Partial<ISuccess>): HTMLElement {
        if (data) {
            this.total = data.total;
        }
        return this.container;
    }
} 