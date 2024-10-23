import { UserInterfaceSubscription, userJson, userJsonSubscription } from '@admin/interfaces/user';
import { UserService } from '@admin/services/user.service';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent implements OnInit {

  private readonly _builder = inject(FormBuilder);
  private readonly _userService = inject(UserService);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _activatedRoute = inject(ActivatedRoute);

  public user = signal<UserInterfaceSubscription>(userJsonSubscription);
  private idUser = this._activatedRoute.snapshot.paramMap.get("id")!;

  public updateUserForm: FormGroup = this._builder.group({

    firstName: this._builder.control('', [Validators.minLength(3), Validators.required, Validators.maxLength(20)]),
    lastName: this._builder.control('', [Validators.minLength(3), Validators.required, Validators.maxLength(20)]),
    email: this._builder.control('', [Validators.email, Validators.required, Validators.maxLength(255)]),
    phone: this._builder.control('', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
    active: this._builder.control(false, [Validators.required])
  });

  ngOnInit(): void {

    this._userService.getUser(this.idUser).subscribe(result => {

      this.user.set(result.data);

      const phone = result.data.phone.split("+569")[1];
      this.updateUserForm.get("firstName")?.setValue(result.data.firstName);
      this.updateUserForm.get("lastName")?.setValue(result.data.lastName);
      this.updateUserForm.get("email")?.setValue(result.data.email);
      this.updateUserForm.get("phone")?.setValue(phone);
      this.updateUserForm.get("active")?.setValue(result.data.active);
      this.updateUserForm.updateValueAndValidity();
    });
  }

  public updateUser(): void {

    if(this.updateUserForm.invalid){
      this.updateUserForm.markAllAsTouched();
      return;
    }

    if(this.updateUserForm.value.phone.length === 8) this.updateUserForm.value.phone = "+569" + this.updateUserForm.value.phone;

    this._userService.updateUser(this.idUser, this.updateUserForm.value).subscribe(() => {

        this._alertService.success("Actualizar Usuario", "Usuario actualizado correctamente");
        this._router.navigate(["/admin/users/list"]);
    });
  }


  get firstName() {
    return this.updateUserForm.controls["firstName"];
  }

  get lastName() {
    return this.updateUserForm.controls["lastName"];
  }

  get email() {
    return this.updateUserForm.controls["email"];
  }

  get phone() {
    return this.updateUserForm.controls["phone"];
  }

  get active() {
    return this.updateUserForm.controls["active"];
  }

}
