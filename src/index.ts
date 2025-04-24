import './scss/styles.scss';
import { TestComponent } from './components/base/Component';

const app = document.getElementById('app');
if (app) {
  const counter = new TestComponent();

  let count = 0;
  counter.setClickHandler(() => {
    count++;
    counter.updateText();
  });

  app.append(counter.render());
}
