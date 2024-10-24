export interface FormLogin {

    email: string;
    password: string;
}

type tokenResponse = {

    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse {

    statusCode: number;
    message: string;
    data: tokenResponse;
}

type ResponseLoginAdminType = {
  idUser: number;
  email: string;
}

export interface LoginAdminResponse {

      statusCode: number;
      message: string;
      data: ResponseLoginAdminType;
}
