
type TokensType = {
  accessToken: string;
  refreshToken: string;
}
type TokenResponse = {

  accessToken: string;
  refreshToken: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface LoginResponse {

  statusCode: number;
  message: string;
  data: TokensType;
}

export interface RefreshTokenResponse {

  statusCode: number;
  message: string;
  data: TokenResponse;
}
