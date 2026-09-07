export interface Quote {
  id: number;
  text: string;
  author: string;
}

export type QuoteRequest = Omit<Quote, 'id'>;
