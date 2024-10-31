import { HttpRequest } from "@angular/common/http";

export const urlsAuthorization: Array<string> = [
  "cart",
  "logout",
  "user",
  "transbank",
  "sales",
  "profile"
]

export function validUrl(req: HttpRequest<unknown>): boolean {

  const url = req.url.split('/');
  const isAuthorizedUrl = url.some(data => urlsAuthorization.includes(data));

  return isAuthorizedUrl;
}
