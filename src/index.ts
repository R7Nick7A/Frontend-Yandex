import './scss/styles.scss';
import { App } from './app';

const app = document.getElementById('app');
if (app) {
  const application = new App();
  app.append(application.render());

  // Экспортируем для возможности использования в консоли браузера
  (window as any).app = application;
}
