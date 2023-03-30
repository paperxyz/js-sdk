import { ModalStyles, StyleObject } from '../../interfaces/Modal';
import { getDefaultModalStyles, modalKeyframeAnimations } from './styles';

export const DRAWER_ID = 'paper-js-sdk-drawer';
export class Drawer {
  protected container: HTMLElement;
  protected main: HTMLDivElement;
  protected overlay: HTMLDivElement;
  protected closeButton: HTMLButtonElement;
  protected iframe: HTMLIFrameElement;
  protected onCloseCallback: (() => void) | undefined;

  protected style: HTMLStyleElement;
  protected closeTimeout: number | undefined;
  styles = getDefaultModalStyles();
  body: HTMLDivElement;

  constructor(container?: HTMLElement, styles?: Partial<ModalStyles>) {
    this.container = container || document.body;

    if (styles) {
      this.mergeStyles(styles);
    }

    this.main = document.createElement('div');
    this.main.id = DRAWER_ID;

    this.overlay = document.createElement('div');
    this.body = document.createElement('div');
    this.closeButton = document.createElement('button');
    this.closeButton.innerHTML = 'x';
    this.closeButton.onclick = () => {
      this.close();
    };
    this.iframe = document.createElement('iframe');
    this.iframe.allow = 'camera; microphone; payment';

    this.style = document.createElement('style');
    this.style.innerHTML = modalKeyframeAnimations;

    this.assignStyles(this.main, this.styles.main);
    this.assignStyles(this.overlay, this.styles.overlay);
    this.assignStyles(this.body, this.styles.body);
    this.assignStyles(this.iframe, this.styles.iframe);
    if (this.styles.closeButton) {
      this.assignStyles(this.closeButton, this.styles.closeButton);
    }
  }

  open({ iframeUrl }: { iframeUrl?: string } = {}) {
    if (iframeUrl) {
      this.iframe.src = iframeUrl;
      this.body.appendChild(this.iframe);
    }

    this.addAccessibility();

    this.main.appendChild(this.overlay);
    this.main.appendChild(this.style);
    this.main.appendChild(this.body);
    this.main.appendChild(this.closeButton);

    this.container.appendChild(this.main);
    document.body.style.overflow = 'hidden';
    return this.iframe;
  }

  close() {
    this.body.style.animation = 'pew-drawer-slideOut 0.2s forwards';

    this.closeTimeout = window.setTimeout(() => {
      document.body.style.overflow = 'visible';
      this.main.remove();

      window.clearTimeout(this.closeTimeout);
      if (this.onCloseCallback) {
        this.onCloseCallback();
      }
    }, 250);
  }

  setOnCloseCallback(callback: () => void) {
    this.onCloseCallback = callback;
  }

  protected mergeStyles(styles: Partial<ModalStyles>) {
    this.styles.body = {
      ...this.styles.body,
      ...(styles.body || {}),
    };

    this.styles.overlay = {
      ...this.styles.overlay,
      ...(styles.overlay || {}),
    };

    this.styles.main = {
      ...this.styles.main,
      ...(styles.main || {}),
    };

    this.styles.iframe = {
      ...this.styles.iframe,
      ...(styles.iframe || {}),
    };
    this.styles.closeButton = {
      ...this.styles.closeButton,
      ...(styles.closeButton || {}),
    };
  }

  protected addAccessibility() {
    this.main.setAttribute('aria-hidden', 'true');
    this.overlay.setAttribute('aria-hidden', 'true');
    this.body.setAttribute('aria-modal', 'true');
    this.body.setAttribute('role', 'dialog');
  }

  protected assignStyles(el: HTMLElement, styles: StyleObject) {
    Object.assign(el.style, styles);
  }
}
