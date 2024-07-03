import { QuoteData } from './quote-data.model';

export interface QuotesSubscribedMessage {
  p: '/quotes/subscribed';
  d: QuoteData[];
}
