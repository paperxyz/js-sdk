export type StyleObject = Partial<CSSStyleDeclaration>;

export interface ModalStyles {
  main: StyleObject;
  overlay: StyleObject;
  body: StyleObject;
  iframe: StyleObject;
  closeButton?: StyleObject;
  spinner: StyleObject;
}

export interface ModalInterface {
  modalContainer?: HTMLElement;
  modalStyles?: Partial<ModalStyles>;
}
