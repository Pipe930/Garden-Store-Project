import { CreateRole, PermissionType, Role } from '@admin/interfaces/role';
import { AccessControlService } from '@admin/services/access-control.service';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';

@Component({
  selector: 'app-update-role',
  standalone: true,
  imports: [RouterLink, NgClass, ReactiveFormsModule],
  templateUrl: './update-role.component.html',
  styleUrl: './update-role.component.scss'
})
export class UpdateRoleComponent implements OnInit {

  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _accessControlService = inject(AccessControlService);
  private readonly _builder = inject(FormBuilder);

  private idRole = this._activatedRoute.snapshot.params["id"];
  private role: Role | null = null;

  public listPermissions = signal<PermissionType[]>([]);
  public selectedPermissions = signal<PermissionType[]>([]);

  public updateFormRole: FormGroup = this._builder.group({
    name: this._builder.control("", [Validators.required, Validators.maxLength(40)])
  });

  ngOnInit(): void {

    this._accessControlService.getRole(this.idRole).subscribe(response => {

      this.role = response.data;
      this.selectedPermissions.set(this.role.permissions);

      this.updateFormRole.get("name")?.setValue(response.data.name);
      this.updateFormRole.updateValueAndValidity();
    });

    this._accessControlService.getAllPermissions().subscribe(response => {

      this.listPermissions.set(response.data.filter(
        permission => !this.selectedPermissions().some(selected => selected.idPermission === permission.idPermission)
      ));
    });

  }

  public updateRole(): void {

    if(this.updateFormRole.invalid){
      this.updateFormRole.markAllAsTouched();
      return;
    }

    const roleJson: CreateRole = {
      name: this.updateFormRole.value.name,
      permissions: this.selectedPermissions()
    }

    this._accessControlService.updateRole(this.idRole, roleJson).subscribe(() => {
      this._alertService.success("Rol actualizado", "El rol se ha actualizado correctamente");
      this._router.navigate(["/admin/access-control/list"]);
    })
  }

  get name() {
    return this.updateFormRole.controls["name"];
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
