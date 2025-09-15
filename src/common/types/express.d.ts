declare module 'http' {
  interface IncomingMessage {
    user?: {
      id: number;
    };
  }
}