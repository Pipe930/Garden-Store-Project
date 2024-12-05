type CategoryType = {
  idCategory: number;
  name: string;
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
  images: Images[];
  offer: string;
  category: CategoryType;
}

export interface ResponseListProducts {

  statusCode: number;
  message: string;
  data: Product[];
}

export interface ResponseProduct {

  statusCode: number;
  message: string;
  data: Product;
}

export interface Images {
  urlImage: string;
  type: string;
}

export const productJson: Product = {

  idProduct: 0,
  title: '',
  price: 0,
  stock: 0,
  sold: 0,
  priceDiscount: 0,
  brand: '',
  published: false,
  rating: 5,
  reviewsCount: 1,
  availabilityStatus: '',
  returnPolicy: '',
  slug: '',
  description: '',
  category: {
    idCategory: 0,
    name: ''
  },
  images: [
    {
      urlImage: '',
      type: ''
    }
  ],
  offer: ''
}
