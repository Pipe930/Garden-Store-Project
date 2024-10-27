import { Permission, permissionJson } from '@admin/interfaces/permission';
import { AccessControlService } from '@admin/services/access-control.service';
import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ValidCheckedInputDirective } from '@core/directives/valid-checked-input.directive';
import { ActionsEnum } from '@core/enums/actions.enum';
import { ResourcesEnum } from '@core/enums/resource.enum';
import { AlertService } from '@core/services/alert.service';

@Component({
  selector: 'app-update-permission',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass, TitleCasePipe, ValidCheckedInputDirective],
  templateUrl: './update-permission.component.html',
  styleUrl: './update-permission.component.scss'
})
export class UpdatePermissionComponent implements OnInit {

  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _builder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _accessControlService = inject(AccessControlService);

  public listResources = signal<ResourcesEnum[]>([...Object.values(ResourcesEnum)]);
  public listActions = signal<ActionsEnum[]>([...Object.values(ActionsEnum)]);
  public permission = signal<Permission>(permissionJson);

  public listActionsSelected: ActionsEnum[] = [];

  private idPermission = this._activatedRoute.snapshot.params["id"];

  public updatePermissionForm: FormGroup = this._builder.group({
    name: this._builder.control("", [Validators.required, Validators.maxLength(100)]),
    resource: this._builder.control("", Validators.required)
  });

  ngOnInit(): void {

    this._accessControlService.getPermission(this.idPermission).subscribe((response) => {

      this.permission.set(response.data);
      this.updatePermissionForm.get("name")?.setValue(response.data.name);
      this.updatePermissionForm.get("resource")?.setValue(response.data.resource);
      this.listActionsSelected = response.data.actions;
    });

  }

  public updatePermission(): void {

    if(this.updatePermissionForm.invalid) {
      this.updatePermissionForm.markAllAsTouched();
      return;
    }

    const formPermission = {
      ...this.updatePermissionForm.value,
      actions: this.listActionsSelected
    }

    this._accessControlService.updatePermission(this.idPermission, formPermission).subscribe(() => {
      this._alertService.success("Permiso Actualizado", "El permiso se ha actualizado correctamente");
      this._router.navigate(["/admin/access-control/list"]);
    });
  }

  public selectAction(event: Event):void {

    const element = event.target as HTMLInputElement;

    if(element.checked) {
      this.listActionsSelected.push(element.value as ActionsEnum);
      return;
    }

    this.listActionsSelected = this.listActionsSelected.filter(action => action !== element.value);
  }

  get name() {
    return this.updatePermissionForm.controls["name"];
  }

  get resource() {
    return this.updatePermissionForm.controls["resource"];
  }

}
