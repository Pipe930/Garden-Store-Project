export interface FormForgotPassword {
  email: string;
}

export interface FormForgotPasswordConfirm {
  token: string;
  uuid: string;
  newPassword: string;
  newRePassword: string;
}

export interface ForgotPasswordResponse {

  statusCode: number;
  message: string;
}
