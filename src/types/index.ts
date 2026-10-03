export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  thumbnail: string;
  category: Category;
  tags: string[];
  technologies: string[];
  rating: number;
  reviewCount: number;
  downloadCount: number;
  version: string;
  lastUpdated: string;
  author: Author;
  isFeatured: boolean;
  isFree: boolean;
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
  description?: string;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface Review {
  id: string;
  user: Pick<User, "id" | "name" | "avatar">;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  price: string;
  timeline: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  verified: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export type Theme = "light" | "dark" | "system";
