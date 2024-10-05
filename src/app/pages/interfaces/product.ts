export interface Product {

  idProduct: number;
  title: string;
  price: number;
  stock: number;
  sold: number;
  priceDiscount: number;
  brand: string;
  published: boolean;
  rating: number;
  reviewsCount: number;
  availabilityStatus: string;
  returnPolicy: string;
  slug: string;
  description: string;
  createAt: Date;
  updateAt: Date;
  idCategory: number;
}

export interface ResponseProducts {
  statusCode: number;
  message: string;
  data: Array<Product>;
}

export interface ResponseProduct {
  statusCode: number;
  message: string;
  data: Product;
}

export const productJson: Product = {
  idProduct: 0,
  title: "",
  brand: "",
  stock: 0,
  price: 0,
  sold: 0,
  priceDiscount: 0,
  published: false,
  rating: 0,
  reviewsCount: 0,
  availabilityStatus: "",
  returnPolicy: "",
  createAt: new Date(),
  updateAt: new Date(),
  slug: "",
  description: "",
  idCategory: 0
}
