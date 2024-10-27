
type rolesUserType = {

  idRole: number;
  name: string;
}

type SubscriptionType = {

  status: string;
  monthsPage: number;
}

export interface UserInterface {

  idUser: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  active: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  rolesUser: rolesUserType[];
}

export interface UserInterfaceSubscription extends UserInterface {
  subscription: SubscriptionType;
}

export interface CreateUserForm {

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  active: boolean;
  password: string;
  rePassword: string;
  createdCart: boolean;
}

export interface VerifyOTPInterface {

  otp: string;
  idUser: number;
}

export interface UpdateUserForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  active: boolean;
}

export interface UserListResponse {

  statusCode: number;
  data: UserInterface[];
}

export interface UserResponse {

  statusCode: number;
  data: UserInterfaceSubscription;
}

export const userJsonSubscription: UserInterfaceSubscription = {

  idUser: 0,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subscription: {
    status: '',
    monthsPage: 0
  },
  active: false,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  rolesUser: []
}

export const userJson: UserInterface = {

  idUser: 0,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  active: false,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  rolesUser: []
}

