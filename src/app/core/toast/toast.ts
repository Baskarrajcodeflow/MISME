/**
 * Toast messages: the app's replacement for window.alert().
 *
 * showToast() shows a small message card at the top right of the screen. Unlike alert() it does
 * not block: the code after the call runs straight away and the message closes by itself.
 * It is a plain function (no injection needed) so it can be called from any component, service,
 * interceptor or guard. The styles are in src/styles.css (.app-toast*).
 */
export type ToastType = 'success' | 'error' | 'info';

/** Used when the caller gives no type: most messages come from the backend, so the type is read from the text. */
const ERROR_WORDS = /fail|error|wrong|invalid|unable|cannot|can't|not |exceed|missing|try again/i;
const SUCCESS_WORDS = /succ|approved|created|updated|authorized|activated|unlocked|saved|completed|sent/i;

const MAX_VISIBLE = 4;
const CLOSE_AFTER_MS = 4000;
const CLOSE_ERROR_AFTER_MS = 6000;

let host: HTMLElement | undefined;

export function showToast(message: unknown, type?: ToastType): void {
  const text = String(message);
  const kind = type ?? (ERROR_WORDS.test(text) ? 'error' : SUCCESS_WORDS.test(text) ? 'success' : 'info');

  if (!host) {
    host = document.createElement('div');
    host.className = 'app-toasts';
    host.setAttribute('aria-live', 'polite');
    document.body.appendChild(host);
  }

  // A message that is already on screen is replaced, not stacked; the oldest go when there are too many
  Array.from(host.children).forEach((shown) => {
    if (shown.firstChild?.textContent === text) shown.remove();
  });
  while (host.children.length >= MAX_VISIBLE) host.firstElementChild!.remove();

  const toast = document.createElement('div');
  toast.className = 'app-toast app-toast-' + kind;
  if (kind === 'error') toast.setAttribute('role', 'alert');

  const body = document.createElement('span');
  body.className = 'app-toast-text';
  body.textContent = text;

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'app-toast-close';
  close.setAttribute('aria-label', 'Dismiss message');
  close.textContent = '×';

  toast.append(body, close);
  host.appendChild(toast);

  // Closes by itself; the countdown waits while the pointer is over the message
  let timer: ReturnType<typeof setTimeout>;
  const dismiss = () => {
    toast.classList.add('app-toast-leave');
    setTimeout(() => toast.remove(), 200);
  };
  const startTimer = () => {
    timer = setTimeout(dismiss, kind === 'error' ? CLOSE_ERROR_AFTER_MS : CLOSE_AFTER_MS);
  };
  close.onclick = dismiss;
  toast.onmouseenter = () => clearTimeout(timer);
  toast.onmouseleave = startTimer;
  startTimer();
}
