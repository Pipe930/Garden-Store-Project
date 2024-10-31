export interface FormLogin {

    email: string;
    password: string;
}

type TokenResponse = {

    accessToken: string;
    refreshToken: string;
}

type OPTResponse = {
  email: string;
  idUser: number;
}

export interface LoginResponse {

    statusCode: number;
    message: string;
    data: TokenResponse | OPTResponse;
}

export interface RefreshTokenResponse {

    statusCode: number;
    message: string;
    data: TokenResponse;
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
