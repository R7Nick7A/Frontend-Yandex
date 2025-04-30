import { Model } from '../base/Model';
import { Product } from '../../types';
import { IEvents } from '../base/events';

export interface ICatalogModel {
    items: Product[];
    loading: boolean;
    error: string | null;
}

export class CatalogModel extends Model<ICatalogModel> {
    protected catalog: Product[] = [];
    protected loading: boolean = false;
    protected error: string | null = null;

    constructor(events: IEvents) {
        super({
            items: [],
            loading: false,
            error: null
        }, events);
    }

    setCatalog(items: Product[]) {
        this.catalog = items;
        this.emitChanges('catalog:changed', { items: this.catalog });
    }

    setLoading(loading: boolean) {
        this.loading = loading;
        this.emitChanges('catalog:loading', { loading: this.loading });
    }

    setError(error: string | null) {
        this.error = error;
        this.emitChanges('catalog:error', { error: this.error });
    }

    getCatalog(): Product[] {
        return this.catalog;
    }

    isLoading(): boolean {
        return this.loading;
    }

    getError(): string | null {
        return this.error;
    }
} 