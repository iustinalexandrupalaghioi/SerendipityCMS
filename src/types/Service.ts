import type { Category } from "./Category";

export type Service = {
  id: string;
  category: Category;
  category_id: string;
  title: string;
  description: string;
  image_public_url: string;
  image_path: string;
  price: number;
  advance_price: number;
  advance_fill_price: number;
  duration: number;
  fill_price: number;
  is_popular: boolean;
  is_active: boolean;
  notes: string;
  created_at: string;
};
