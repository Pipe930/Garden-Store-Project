export interface Profile {

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ResponseProfile {

  data: Profile;
  message: string;
  statusCode: number;
}

export const profileJson: Profile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
}
