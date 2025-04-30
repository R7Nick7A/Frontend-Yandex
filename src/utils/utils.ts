export function pascalToKebab(value: string): string {
    return value.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function isSelector(x: unknown): x is string {
    return typeof x === "string" && x.length > 1;
}

export function isEmpty(value: unknown): boolean {
    return value === null || value === undefined;
}

export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

export function ensureAllElements<T extends HTMLElement>(
    selectorElement: SelectorCollection<T>, 
    context: HTMLElement = document as unknown as HTMLElement
): T[] {
    try {
        if (isSelector(selectorElement)) {
            return Array.from(context.querySelectorAll(selectorElement)) as T[];
        }
        if (selectorElement instanceof NodeList) {
            return Array.from(selectorElement) as T[];
        }
        if (Array.isArray(selectorElement)) {
            return selectorElement;
        }
        throw new Error(`Unknown selector element type: ${typeof selectorElement}`);
    } catch (error) {
        console.error('Error in ensureAllElements:', error);
        throw error;
    }
}

export type SelectorElement<T> = T | string;

export function ensureElement<T extends HTMLElement>(
    selectorElement: SelectorElement<T>, 
    context?: HTMLElement
): T {
    try {
        if (isSelector(selectorElement)) {
            const elements = ensureAllElements<T>(selectorElement, context);
            if (elements.length > 1) {
                console.warn(`Selector "${selectorElement}" returned more than one element`);
            }
            if (elements.length === 0) {
                throw new Error(`Selector "${selectorElement}" returned no elements`);
            }
            const element = elements[0];
            
            // Проверяем, что элемент существует в DOM, но пропускаем template элементы
            if (!(element instanceof HTMLTemplateElement) && !document.contains(element)) {
                throw new Error(`Element "${selectorElement}" is not in DOM`);
            }
            
            return element;
        }
        if (selectorElement instanceof HTMLElement) {
            // Проверяем, что элемент существует в DOM, но пропускаем template элементы
            if (!(selectorElement instanceof HTMLTemplateElement) && !document.contains(selectorElement)) {
                throw new Error('Element is not in DOM');
            }
            return selectorElement as T;
        }
        throw new Error(`Invalid selector element type: ${typeof selectorElement}`);
    } catch (error) {
        console.error('Error in ensureElement:', error);
        throw error;
    }
}

export function cloneTemplate<T extends HTMLElement>(
    query: string | HTMLTemplateElement
): T {
    try {
        const template = ensureElement(query) as HTMLTemplateElement;
        
        // Проверяем, что это действительно template элемент
        if (!(template instanceof HTMLTemplateElement)) {
            throw new Error('Element is not a template');
        }

        // Проверяем наличие контента
        if (!template.content) {
            throw new Error('Template has no content');
        }

        // Проверяем наличие первого элемента
        if (!template.content.firstElementChild) {
            throw new Error('Template is empty');
        }

        // Проверяем, что клонированный элемент является HTMLElement
        const clonedElement = template.content.firstElementChild.cloneNode(true);
        if (!(clonedElement instanceof HTMLElement)) {
            throw new Error('Cloned element is not an HTMLElement');
        }

        return clonedElement as T;
    } catch (error) {
        console.error('Error in cloneTemplate:', error);
        throw error;
    }
}

export function bem(
    block: string, 
    element?: string, 
    modifier?: string
): { name: string; class: string } {
    let name = block;
    if (element) name += `__${element}`;
    if (modifier) name += `_${modifier}`;
    return {
        name,
        class: `.${name}`
    };
}

export function getObjectProperties(obj: object, filter?: (name: string, prop: PropertyDescriptor) => boolean): string[] {
    return Object.entries(
        Object.getOwnPropertyDescriptors(
            Object.getPrototypeOf(obj)
        )
    )
        .filter(([name, prop]: [string, PropertyDescriptor]) => filter ? filter(name, prop) : (name !== 'constructor'))
        .map(([name, prop]) => name);
}

/**
 * Устанавливает dataset атрибуты элемента
 */
export function setElementData<T extends Record<string, unknown> | object>(el: HTMLElement, data: T) {
    for (const key in data) {
        el.dataset[key] = String(data[key]);
    }
}

/**
 * Получает типизированные данные из dataset атрибутов элемента
 */
export function getElementData<T extends Record<string, unknown>>(el: HTMLElement, scheme: Record<string, Function>): T {
    const data: Partial<T> = {};
    for (const key in el.dataset) {
        data[key as keyof T] = scheme[key](el.dataset[key]);
    }
    return data as T;
}

/**
 * Проверка на простой объект
 */
export function isPlainObject(obj: unknown): obj is object {
    const prototype = Object.getPrototypeOf(obj);
    return  prototype === Object.getPrototypeOf({}) ||
        prototype === null;
}

export function isBoolean(v: unknown): v is boolean {
    return typeof v === 'boolean';
}

/**
 * Фабрика DOM-элементов в простейшей реализации
 * здесь не учтено много факторов
 * в интернет можно найти более полные реализации
 */
export function createElement<
    T extends HTMLElement
    >(
    tagName: keyof HTMLElementTagNameMap,
    props?: Partial<Record<keyof T, string | boolean | object>>,
    children?: HTMLElement | HTMLElement []
): T {
    const element = document.createElement(tagName) as T;
    if (props) {
        for (const key in props) {
            const value = props[key];
            if (isPlainObject(value) && key === 'dataset') {
                setElementData(element, value);
            } else {
                // Безопасное приведение типов для свойств элемента
                (element as any)[key] = isBoolean(value) ? value : String(value);
            }
        }
    }
    if (children) {
        for (const child of Array.isArray(children) ? children : [children]) {
            element.append(child);
        }
    }
    return element;
}

/**
 * Проверяет, является ли элемент HTMLElement.
 * @param element - элемент для проверки.
 */
export function isHTMLElement(element: unknown): element is HTMLElement {
  return element instanceof HTMLElement;
}

/**
 * Находит элемент в DOM по селектору.
 * @param selector - селектор или сам HTMLElement.
 * @param container - контейнер для поиска.
 * @throws {Error} если элемент не найден.
 */
export function ensureElement<T extends HTMLElement>(selector: string | HTMLElement, container: HTMLElement): T {
  const element = typeof selector === 'string' ? container.querySelector<T>(selector) : selector;
  if (!element) {
    throw new Error(`Element ${selector} not found`);
  }
  return element;
}

/**
 * Клонирует шаблон.
 * @param template - селектор шаблона.
 */
export function cloneTemplate(template: string): HTMLElement {
  const element = document.querySelector<HTMLTemplateElement>(template);
  if (!element) {
    throw new Error(`Template ${template} not found`);
  }
  return element.content.cloneNode(true) as HTMLElement;
}

/**
 * Создает элемент с заданными параметрами.
 * @param tag - тег элемента.
 * @param options - опции для создания элемента.
 */
export function createElement<T extends HTMLElement>(tag: string, options: {
  className?: string;
  innerHTML?: string;
  textContent?: string;
}): T {
  const element = document.createElement(tag) as T;
  if (options.className) {
    element.className = options.className;
  }
  if (options.innerHTML) {
    element.innerHTML = options.innerHTML;
  }
  if (options.textContent) {
    element.textContent = options.textContent;
  }
  return element;
}