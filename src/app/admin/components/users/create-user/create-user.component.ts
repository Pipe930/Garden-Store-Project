import { Role } from '@admin/interfaces/role';
import { CreateUserForm } from '@admin/interfaces/user';
import { AccessControlService } from '@admin/services/access-control.service';
import { UserService } from '@admin/services/user.service';
import { NgClass } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
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
export class CreateUserComponent implements OnInit {

  private readonly _userService = inject(UserService);
  private readonly _router = inject(Router);
  private readonly _builder = inject(FormBuilder);
  private readonly _alerService = inject(AlertService);
  private readonly _validatorService = inject(ValidatorService);
  private readonly _accessControlService = inject(AccessControlService);

  public alerMessage = signal<boolean>(false);
  public listRoles = signal<Role[]>([]);
  public selectedRoles = signal<Role[]>([]);
  public selectOptionCreatedCartUser = false;

  public createUserForm: FormGroup = this._builder.group({

    firstName: this._builder.control('', [Validators.minLength(3), Validators.required, Validators.maxLength(20)]),
    lastName: this._builder.control('', [Validators.minLength(3), Validators.required, Validators.maxLength(20)]),
    email: this._builder.control('', [Validators.email, Validators.required, Validators.maxLength(255)]),
    password: this._builder.control('', [Validators.minLength(6), Validators.maxLength(50), Validators.required]),
    rePassword: this._builder.control('', [Validators.minLength(6), Validators.maxLength(50), Validators.required]),
    phone: this._builder.control('', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
    createdCart: this._builder.control(false, [Validators.required]),
    active: this._builder.control(false, [Validators.required])
  }, {
    validators: [this._validatorService.comparePasswords("password", "rePassword")]
  });

  ngOnInit(): void {

    this._accessControlService.getAllRoles().subscribe((response) => {
      this.listRoles.set(response.data);
    });
  }

  public createUser(): void {

    if(this.createUserForm.invalid){
      this.createUserForm.markAllAsTouched();
      return;
    }

    if(this.createUserForm.value.phone.length === 8) this.createUserForm.value.phone = `+569${this.createUserForm.value.phone}`;

    const userJson: CreateUserForm = {
      ...this.createUserForm.value,
      createdCart: this.selectOptionCreatedCartUser,
      roles: this.selectedRoles()
    }

    this._userService.createUser(userJson).pipe(
      catchError((error) => {

        if(error.error.statusCode === HttpStatusCode.Conflict){
          this.alerMessage.set(true);

          const timer = setTimeout(() => {
            this.alerMessage.set(false);
          }, 5000);
          clearTimeout(timer);
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

  public changeOptionCreateCartUser(event: Event): void{

    const element = event.target as HTMLInputElement;

    this.selectOptionCreatedCartUser = element.value === "true" ? true : false;
  }

  moveRight(selectedOptions: HTMLCollection) {

    if(selectedOptions.length === 0) return;

    const selectedIds = Array.from(selectedOptions).map((option: any) => parseInt(option.value, 10));

    this.listRoles().filter(role => {
      if (selectedIds.includes(role.idRole)) {
        this.selectedRoles().push(role);
        this.listRoles().splice(this.listRoles().indexOf(role), 1);
      }
    });
  }

  moveLeft(selectedOptions: HTMLCollection) {

    if(selectedOptions.length === 0) return;

    const selectedIds = Array.from(selectedOptions).map((option: any) => parseInt(option.value, 10));

    this.selectedRoles().filter(role => {
      if (selectedIds.includes(role.idRole)) {
        this.listRoles().push(role);
        this.selectedRoles().splice(this.selectedRoles().indexOf(role), 1);
      }
    });
  }

  selectAll() {

    this.selectedRoles.set(this.selectedRoles().concat(this.listRoles()))
    this.listRoles.set([]);
  }

  removeAll() {
    this.listRoles.set(this.listRoles().concat(this.selectedRoles()));
    this.selectedRoles.set([]);
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
