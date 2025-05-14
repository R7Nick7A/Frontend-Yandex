import { IEventEmitter, IItem, IModalView } from "../types";
import { cloneTemplate } from "../utils/utils";

export class ModalView implements IModalView {
  protected closeButton: HTMLButtonElement;
  protected finishButton: HTMLButtonElement;
  protected container: HTMLElement;
  protected modal: HTMLElement;
  protected events: IEventEmitter;
  protected item?: IItem;
  protected page: HTMLElement;

  private static instance: ModalView;

  private constructor(events: IEventEmitter) {
    this.modal = document.querySelector('#modal-container') as HTMLElement;
    this.events = events;
    this.container = this.modal.querySelector('.modal__content') as HTMLElement;
    this.closeButton = this.modal.querySelector('.modal__close') as HTMLButtonElement;
    this.page = document.querySelector('.page') as HTMLElement;

    // клик по кнопке закрытия
    this.closeButton.addEventListener(('click'), this.closeModal.bind(this));

    // клик по оверлею
    this.modal.addEventListener(('mousedown'), (event) => {
      if(event.target === event.currentTarget) {
        this.closeModal();
      }
    })

    // клик по Esc
    this.handleEscUp = this.handleEscUp.bind(this);
  }

  static getInstance(events: IEventEmitter): ModalView {
    if (!ModalView.instance) {
      ModalView.instance = new ModalView(events);
    }

    return ModalView.instance;
}

  protected handleEscUp(event: KeyboardEvent) {
    if(event.key === "Escape") {
      this.closeModal();
    }
  }

  openModal(element: HTMLElement) {
    this.clearModal();
    document.addEventListener(('keyup'), this.handleEscUp);
    this.modal.classList.add('modal_active');
    this.page.classList.add('page__wrapper_locked');
    this.render(element);
  }

  closeModal() {
    this.modal.classList.remove('modal_active');
    this.page.classList.remove('page__wrapper_locked');
    this.clearModal();
    document.removeEventListener("keyup", this.handleEscUp);
  }

  protected clearModal() {
    this.container.innerHTML = '';
  }

  protected render(element: HTMLElement) {
    this.container.append(element);
  }
}