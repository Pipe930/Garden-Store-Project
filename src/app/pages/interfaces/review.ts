
type UserType = {
  firstName: string;
  lastName: string;
}

export interface Review {

  idReview: number;
  idProduct: number;
  idUser: number;
  rating: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserType;
}

export interface ListReviewResponse {
  data: Review[];
  statusCode: number;
}

export interface CreateReview {

  idProduct: number;
  rating: number;
  title: string;
  content: string;
}
