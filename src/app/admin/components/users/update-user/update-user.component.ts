import { Role } from '@admin/interfaces/role';
import { RolesUserType, UpdateUserForm, UserInterfaceSubscription, userJson, userJsonSubscription } from '@admin/interfaces/user';
import { AccessControlService } from '@admin/services/access-control.service';
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
  private readonly _accessControlService = inject(AccessControlService);

  public user = signal<UserInterfaceSubscription>(userJsonSubscription);
  private idUser = this._activatedRoute.snapshot.paramMap.get("id")!;
  public listRoles = signal<RolesUserType[]>([]);
  public selectedRoles = signal<RolesUserType[]>([]);

  public updateUserForm: FormGroup = this._builder.group({

    firstName: this._builder.control('', [Validators.minLength(3), Validators.required, Validators.maxLength(20)]),
    lastName: this._builder.control('', [Validators.minLength(3), Validators.required, Validators.maxLength(20)]),
    email: this._builder.control('', [Validators.email, Validators.required, Validators.maxLength(255)]),
    phone: this._builder.control('', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
    active: this._builder.control(false, [Validators.required])
  });

  ngOnInit(): void {

    this._userService.getUser(this.idUser).subscribe(response => {

      this.user.set(response.data);
      this.selectedRoles.set(response.data.rolesUser);

      this.updateUserForm.get("firstName")?.setValue(response.data.firstName);
      this.updateUserForm.get("lastName")?.setValue(response.data.lastName);
      this.updateUserForm.get("email")?.setValue(response.data.email);
      this.updateUserForm.get("phone")?.setValue(response.data.phone.split("+569")[1]);
      this.updateUserForm.get("active")?.setValue(response.data.active);
      this.updateUserForm.updateValueAndValidity();
    });

    this._accessControlService.getAllRoles().subscribe(response => {

      this.listRoles.set(response.data.filter(
        role => !this.selectedRoles().some(selected => selected.idRole === role.idRole)
      ));
    })

  }

  public updateUser(): void {

    if(this.updateUserForm.invalid){
      this.updateUserForm.markAllAsTouched();
      return;
    }

    if(this.updateUserForm.value.phone.length === 8) this.updateUserForm.value.phone = "+569" + this.updateUserForm.value.phone;

    const userJson: UpdateUserForm = {
      ...this.updateUserForm.value,
      roles: this.selectedRoles()
    }

    this._userService.updateUser(this.idUser, userJson).subscribe(() => {

        this._alertService.success("Actualizar Usuario", "Usuario actualizado correctamente");
        this._router.navigate(["/admin/users/list"]);
    });
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
