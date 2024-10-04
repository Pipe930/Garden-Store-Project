import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  public emailValidator(control: AbstractControl): { [key: string]: any } | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: { valid: false } };
  }

  public comparePasswords(passwordKey: string, re_password: string) {

    return (group: FormGroup): {[key: string]: any} => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[re_password];

      if (password.value !== confirmPassword.value) {
        return { passordsDontMatch: true };
      }

      return {};
    }
  }

  public onlyNumbersValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const esNumerico = /^\d+$/.test(control.value);
      return esNumerico ? null : { 'onlyNumbers': { value: control.value } };
    };
  }
}
