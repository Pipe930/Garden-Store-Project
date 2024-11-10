type UserType = {
  firstName: string;
  lastName: string;
}

export interface Comment {

  idComment: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: UserType;
}

export interface ListCommentsResponse {

  statusCode: number;
  data: Comment[];
}

export interface CreateComment {

  comment: string;
  idPost: number;
}
