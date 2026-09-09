import './styles.css';
import { DanbiApp } from './app/DanbiApp';

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Required element not found: ${selector}`);
  return element;
}

const app = new DanbiApp(
  requireElement<HTMLCanvasElement>('#scene'),
  requireElement<HTMLElement>('#ui'),
);

app.start();

if (import.meta.hot) {
  import.meta.hot.dispose(() => app.dispose());
}
