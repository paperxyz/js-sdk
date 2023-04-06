import type { StyleObject } from "@paperxyz/sdk-common-utilities";

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
