import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

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

  public uniqueProductValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const products = (control as FormArray).controls;
      const productIds = products.map(product => product.get('idProduct')?.value);
      const hasDuplicates = productIds.some((id, index) => productIds.indexOf(id) !== index);
      return hasDuplicates ? { duplicateProduct: true } : null;
    };
  }
}
