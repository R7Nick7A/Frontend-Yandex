import { IEvents } from './events';
import { ensureElement, cloneTemplate, bem } from '../../utils/utils';

/**
 * Базовый абстрактный компонент для отображения UI-элементов.
 * @template T - тип данных, необходимых для рендеринга компонента.
 */
export abstract class Component<T extends object = {}> {
  protected container: HTMLElement;

  /**
   * @param templateSelector - селектор <template> или сам HTMLTemplateElement.
   * @param containerSelector - селектор контейнера или сам HTMLElement для рендера.
   */
  protected constructor(
    templateSelector: string | HTMLTemplateElement,
    containerSelector: string | HTMLElement
  ) {
    // Клонируем шаблон
    this.container = cloneTemplate<HTMLElement>(templateSelector);
    // Вставляем в родительский контейнер
    const parent = ensureElement<HTMLElement>(containerSelector);
    parent.append(this.container);
  }

  /**
   * Переключает класс на элементе.
   * @param elementSelector - селектор или сам HTMLElement.
   * @param className - имя класса.
   * @param force - необязательно: принудительно добавить/удалить.
   */
  protected toggleClass(
    elementSelector: string | HTMLElement,
    className: string,
    force?: boolean
  ) {
    const el = ensureElement<HTMLElement>(elementSelector, this.container);
    el.classList.toggle(className, force);
  }

  /**
   * Устанавливает текстовое содержимое элемента.
   * @param elementSelector - селектор или сам HTMLElement.
   * @param value - значение для отображения.
   */
  protected setText(
    elementSelector: string | HTMLElement,
    value: unknown
  ) {
    const el = ensureElement<HTMLElement>(elementSelector, this.container);
    el.textContent = String(value);
  }

  /**
   * Устанавливает состояние disabled для элемента.
   * @param elementSelector - селектор или сам HTMLElement.
   * @param state - true для блокировки, false для разблокировки.
   */
  protected setDisabled(
    elementSelector: string | HTMLElement,
    state: boolean
  ) {
    const el = ensureElement<HTMLElement>(elementSelector, this.container);
    if (state) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');
  }

  /**
   * Скрывает элемент (display: none).
   * @param elementSelector - селектор или сам HTMLElement.
   */
  protected setHidden(elementSelector: string | HTMLElement) {
    const el = ensureElement<HTMLElement>(elementSelector, this.container);
    el.style.display = 'none';
  }

  /**
   * Показывает элемент (удаляет display: none).
   * @param elementSelector - селектор или сам HTMLElement.
   */
  protected setVisible(elementSelector: string | HTMLElement) {
    const el = ensureElement<HTMLElement>(elementSelector, this.container);
    el.style.removeProperty('display');
  }

  /**
   * Устанавливает src и alt у <img>.
   * @param elementSelector - селектор или сам <img>.
   * @param src - путь к изображению.
   * @param alt - альтернативный текст.
   */
  protected setImage(
    elementSelector: string | HTMLImageElement,
    src: string,
    alt?: string
  ) {
    const img = ensureElement<HTMLImageElement>(elementSelector as any, this.container);
    img.src = src;
    if (alt) img.alt = alt;
  }

  /**
   * Подписка на событие.
   * @param events - шина событий.
   * @param eventName - имя события.
   * @param callback - колбэк при получении события.
   */
  protected onEvent<TData extends object>(
    events: IEvents,
    eventName: string,
    callback: (data: TData) => void
  ) {
    events.on<TData>(eventName, callback);
  }

  /**
   * Возвращает контейнер компонента в DOM.
   * @param data - опциональные данные для присвоения полям компонента перед рендером.
   */
  render(data?: Partial<T>): HTMLElement {
    if (data) Object.assign(this as any, data);
    return this.container;
  }
}


import { events } from './events'; // Используем экспортированный объект

export class TestComponent extends Component<{ text: string }> {
  private count = 0;

  constructor() {
    super('#button-template', '#container');
    this.updateText();

    this.onEvent<{ count: number }>(events, 'increment', (data) => {
      this.count += data.count;
      this.updateText();
    });
  }

  private renderText() {
    return `Нажато: ${this.count}`;
  }

  public updateText() {
    this.setText('#button-text', this.renderText());
  }

  public setClickHandler(handler: () => void) {
    const button = this.container.querySelector('#button-text');
    if (button) button.addEventListener('click', handler);
  }

  render() {
    return this.container;
  }
}
