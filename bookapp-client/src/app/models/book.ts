export interface Book {
  id: number;
  title: string;
  author: string;
  publishedDate: string;
}

export type BookRequest = Omit<Book, 'id'>;
