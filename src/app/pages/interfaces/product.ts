type imageType = {
  urlImage: string;
  type: string;
}

type TypeCategory = {
  idCategory: number;
  name: string;
}

type TypeOffer = {
  idOffer: number;
  name: string;
  discount: number;
}

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
  images: Array<imageType>;
  category: TypeCategory;
  offer: TypeOffer;
}

export interface ResponseProducts {
  statusCode: number;
  message: string;
  currentPage: number;
  totalPages: number;
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
  category: {
    idCategory: 0,
    name: ""
  },
  offer: {
    idOffer: 0,
    name: "",
    discount: 0
  },
  images: []
}
