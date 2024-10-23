import { UserService } from '@admin/services/user.service';
import { NgClass } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { ValidatorService } from '@core/services/validator.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {

  private readonly _userService = inject(UserService);
  private readonly _router = inject(Router);
  private readonly _builder = inject(FormBuilder);
  private readonly _alerService = inject(AlertService);
  private readonly _validatorService = inject(ValidatorService);

  public alerMessage = signal<boolean>(false);

  public createUserForm: FormGroup = this._builder.group({

    firstName: this._builder.control('', [Validators.minLength(3), Validators.required, Validators.maxLength(20)]),
    lastName: this._builder.control('', [Validators.minLength(3), Validators.required, Validators.maxLength(20)]),
    email: this._builder.control('', [Validators.email, Validators.required, Validators.maxLength(255)]),
    password: this._builder.control('', [Validators.minLength(6), Validators.maxLength(50), Validators.required]),
    rePassword: this._builder.control('', [Validators.minLength(6), Validators.maxLength(50), Validators.required]),
    phone: this._builder.control('', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
    active: this._builder.control(false, [Validators.required])
  }, {
    validators: [this._validatorService.comparePasswords("password", "rePassword")]
  });

  public createUser(): void {

    if(this.createUserForm.invalid){
      this.createUserForm.markAllAsTouched();
      return;
    }

    if(this.createUserForm.value.phone.length === 8) this.createUserForm.value.phone = `+569${this.createUserForm.value.phone}`;

    this._userService.createUser(this.createUserForm.value).pipe(
      catchError((error) => {

        if(error.error.statusCode === HttpStatusCode.Conflict){
          this.alerMessage.set(true);

          setTimeout(() => {
            this.alerMessage.set(false);
          }, 5000);
          return of();
        }

        this._alerService.error("Error Usuario", error.error.message);
        return of();
      })
    ).subscribe(() => {
      this._alerService.success("Usuario creado exitosamente", "Usuario");
      this._router.navigate(['/admin/users/list']);
    });
  }

  get firstName() {
    return this.createUserForm.controls["firstName"];
  }

  get lastName() {
    return this.createUserForm.controls["lastName"];
  }

  get email() {
    return this.createUserForm.controls["email"];
  }

  get password() {
    return this.createUserForm.controls["password"];
  }

  get rePassword() {
    return this.createUserForm.controls["rePassword"];
  }

  get phone() {
    return this.createUserForm.controls["phone"];
  }

  get active() {
    return this.createUserForm.controls["active"];
  }
}
