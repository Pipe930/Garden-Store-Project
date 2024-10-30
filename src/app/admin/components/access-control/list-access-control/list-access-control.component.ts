import { columnsPermission, Permission } from '@admin/interfaces/permission';
import { columnsRole, Role } from '@admin/interfaces/role';
import { AccessControlService } from '@admin/services/access-control.service';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableColumns } from '@core/interfaces/table';
import { TableComponent } from '@shared/table/table.component';

@Component({
  selector: 'app-list-access-control',
  standalone: true,
  imports: [RouterLink, TableComponent],
  templateUrl: './list-access-control.component.html',
  styleUrl: './list-access-control.component.scss'
})
export class ListAccessControlComponent implements OnInit {

  private readonly _router = inject(Router);

  public listRoles = signal<Role[]>([]);
  public listPermission = signal<Permission[]>([]);

  public columnsRole = signal<TableColumns[]>(columnsRole);
  public columnsPermission = signal<TableColumns[]>(columnsPermission);
  public isLoadingRole = signal<boolean>(false);
  public isLoadingPermission = signal<boolean>(false);

  private readonly _accessControlService = inject(AccessControlService)

  ngOnInit(): void {

    this._accessControlService.getAllRoles().subscribe((response) => {
      if(response.statusCode === HttpStatusCode.Ok) this.listRoles.set(response.data);
      this.isLoadingRole.set(true);
    });

    this._accessControlService.getAllPermissions().subscribe((response) => {
      if(response.statusCode === HttpStatusCode.Ok) this.listPermission.set(response.data);
      this.isLoadingPermission.set(true);
    });
  }

  public editRole(role: Role): void {
    this._router.navigate(["admin/access-control/role/edit", role.idRole]);
  }

  public editPermission(permission: Permission): void {
    this._router.navigate(["admin/access-control/permission/edit", permission.idPermission]);
  }
}
