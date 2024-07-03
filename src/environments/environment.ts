import { Env } from './environment.common';

export const environment: Env = {
  production: true,
  instance: 'production',
  baseAppUrl: 'localhost:4200',
  apiUrl: 'https://geeksoft.pl/assets/order-data.json',
  webSockets: {
    webSocketUrl: 'wss://webquotes.geeksoft.pl/websocket/quotes',
    addListAddress: '/subscribe/addlist',
    subscribeAddress: '/quotes/subscribed',
    unsubscribeAddress: '/subscribe/removelist'
  }
};
