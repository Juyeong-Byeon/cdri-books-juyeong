export interface Book {
  id: string;
  title: string;
  contents: string;
  url: string;
  isbn: string;
  authors: string[];
  publisher: string;
  translators: string[];
  publishedAt: string | null;
  thumbnail: string | null;
  price: number | null;
  salePrice: number | null;
  status: string | null;
}
