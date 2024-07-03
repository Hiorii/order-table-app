export interface Env {
  production: boolean;
  instance: string;
  baseAppUrl: string;
  apiUrl: string;
  webSockets: {
    webSocketUrl: string;
    addListAddress: string;
    subscribeAddress: string;
    unsubscribeAddress: string;
  };
}
