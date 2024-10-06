import { environment } from "../../../environments/environment.development";

export const urlsAuthorization: Array<string> = [
  `${environment.api}/cart/user`,
  `${environment.api}/cart/add/item`,
  `${environment.api}/cart/substract/item`,
  `${environment.api}/cart/remove/item`,
  `${environment.api}/cart/clear`,
  `${environment.api}/auth/logout`,
  `${environment.api}/address/user`,
  `${environment.api}/sales/transbank/create`
]
