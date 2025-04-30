import { IEvents } from './events';

/**
 * Базовая модель для работы с данными и событиями.
 * @template T - тип данных модели.
 */
export abstract class Model<T extends object> {
  protected events: IEvents;

  /**
   * @param data - начальные данные модели.
   * @param events - шина событий для рассылки изменений.
   */
  constructor(data: Partial<T>, events: IEvents) {
    Object.assign(this, data);
    this.events = events;
  }

  /**
   * Эмитит событие об изменении модели.
   * @param eventName - имя события.
   * @param payload - опциональные данные изменения.
   */
  protected emitChanges(eventName: string, payload?: Partial<T>) {
    this.events.emit(eventName, payload as T);
  }
}

