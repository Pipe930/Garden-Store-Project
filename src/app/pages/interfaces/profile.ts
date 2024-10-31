

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ResponseProfile {

  status: number;
  data: Profile;
}

export interface ChangePasswordForm {

  currentPassword: string;
  newPassword: string;
  reNewPassword: string;
}

export const profileJson = {
  firstName: "",
  lastName: "",
  email: "",
  phone: ""
}
