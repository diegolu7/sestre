export interface Product {
  id: string;
  name: string;
  price?: string;
  image?: string;
  images?: string[];
  sizes?: string[];
  fit_information?: string;
  description?: string;
  category?: string;
  is_new?: boolean;
}
