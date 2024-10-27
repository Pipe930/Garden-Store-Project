import { columnsPermission, Permission } from '@admin/interfaces/permission';
import { columnsRole, Role } from '@admin/interfaces/role';
import { AccessControlService } from '@admin/services/access-control.service';
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

  private readonly _accessControlService = inject(AccessControlService)

  ngOnInit(): void {
    this._accessControlService.getAllRoles().subscribe((response) => {
      this.listRoles.set(response.data);
    });

    this._accessControlService.getAllPermissions().subscribe((response) => {
      this.listPermission.set(response.data);
    });
  }

  public editRole(role: Role): void {


  }

  public editPermission(permission: Permission): void {
    this._router.navigate(["admin/access-control/permission/edit", permission.idPermission]);
  }
}
