export type MessageType<T> =
  | {
      eventType: string;
      success: true;
      data: T;
    }
  | {
      eventType: string;
      success: false;
      error: Error;
    };
