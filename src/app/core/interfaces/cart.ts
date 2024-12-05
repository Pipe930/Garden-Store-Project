
type category = {
  name: string;
}

interface ProductCart {
  idProduct: number;
  title: string;
  brand: string;
  priceDiscount: number;
  images: Array<any>;
  price: number;
  stock: number;
  category: category;
}

interface ItemCart {
  product: ProductCart;
  quantity: number;
  priceUnit: number;
}

interface AddCart {
  idProduct: number;
  quantity: number;
}

export interface FormRemoveCart{
  idProduct: number;
}

export interface FormAddCart{
  idProduct: number;
  quantity: number;
}

export interface Cart {
  idCartUser: number;
  items: Array<ItemCart>;
  priceTotal: number;
  quantityTotal: number;
  productsTotal: number;
  priceTotalDiscount: number;
}

export interface ResponseCart {
  status: string;
  data: Cart;
}

export interface ReponseAddCart{
  status: string;
  data: AddCart;
  message: string;
}

export const cartJson: Cart = {
  idCartUser: 0,
  items: [
    {
      product: {
        idProduct: 0,
        title: "",
        stock: 0,
        brand: "",
        priceDiscount: 0,
        price: 0,
        images: [],
        category: {
          name: ""
        }
      },
      priceUnit: 0,
      quantity: 0
    }
  ],
  priceTotal: 0,
  productsTotal: 0,
  quantityTotal: 0,
  priceTotalDiscount: 0
};
