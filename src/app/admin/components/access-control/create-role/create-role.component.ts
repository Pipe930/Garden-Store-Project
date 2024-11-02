import { CreateRole, PermissionType } from '@admin/interfaces/role';
import { AccessControlService } from '@admin/services/access-control.service';
import { NgClass } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-create-role',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.scss'
})
export class CreateRoleComponent implements OnInit {

  private readonly _accessControlService = inject(AccessControlService);
  private readonly _builder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);

  public listPermissions = signal<PermissionType[]>([]);
  public selectedPermissions = signal<PermissionType[]>([]);
  public alertMessage = signal<boolean>(false);

  public createRoleForm: FormGroup = this._builder.group({
    name: this._builder.control("", [Validators.required, Validators.maxLength(40)])
  });

  public createRole(): void {

    if(this.createRoleForm.invalid) {
      this.createRoleForm.markAllAsTouched();
      return;
    }

    const roleJson: CreateRole = {
      name: this.createRoleForm.value.name,
      permissions: this.selectedPermissions()
    }

    this._accessControlService.createRole(roleJson).pipe(
      catchError((error) => {

        if (error.status === 409) {
          this.alertMessage.set(true);

          const timer = setTimeout(() => {
            this.alertMessage.set(false);
          }, 5000);
          clearTimeout(timer);
          return EMPTY;
        }

        return EMPTY;
      })
    ).subscribe(() => {
      this._alertService.success("Rol Creado", "El rol ha sido creado correctamente");
      this._router.navigate(["/admin/access-control/list"]);
    })
  }

  ngOnInit(): void {
    this._accessControlService.getAllPermissions().subscribe(permissions => {
      this.listPermissions.set(permissions.data);
    })
  }

  get name() {
    return this.createRoleForm.controls["name"];
  }

  moveRight(selectedOptions: HTMLCollection) {

    if(selectedOptions.length === 0) return;

    const selectedIds = Array.from(selectedOptions).map((option: any) => parseInt(option.value, 10));

    this.listPermissions().filter(permission => {
      if (selectedIds.includes(permission.idPermission)) {
        this.selectedPermissions().push(permission);
        this.listPermissions().splice(this.listPermissions().indexOf(permission), 1);
      }
    });
  }

  moveLeft(selectedOptions: HTMLCollection) {

    if(selectedOptions.length === 0) return;

    const selectedIds = Array.from(selectedOptions).map((option: any) => parseInt(option.value, 10));

    this.selectedPermissions().filter(permission => {
      if (selectedIds.includes(permission.idPermission)) {
        this.listPermissions().push(permission);
        this.selectedPermissions().splice(this.selectedPermissions().indexOf(permission), 1);
      }
    });
  }

  selectAll() {

    this.selectedPermissions.set(this.selectedPermissions().concat(this.listPermissions()))
    this.listPermissions.set([]);
  }

  removeAll() {
    this.listPermissions.set(this.listPermissions().concat(this.selectedPermissions()));
    this.selectedPermissions.set([]);
  }

}
