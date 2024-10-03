export interface FormRegister {

    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    rePassword: string;
    phone: string;
}

export interface RegisterResponse {

  statusCode: number;
  message: string;
  data: any;
}
