import { CreatePermission } from '@admin/interfaces/permission';
import { AccessControlService } from '@admin/services/access-control.service';
import { NgClass, TitleCasePipe } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActionsEnum } from '@core/enums/actions.enum';
import { ResourcesEnum } from '@core/enums/resource.enum';
import { AlertService } from '@core/services/alert.service';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-create-permission',
  standalone: true,
  imports: [RouterLink, NgClass, ReactiveFormsModule, TitleCasePipe],
  templateUrl: './create-permission.component.html',
  styleUrl: './create-permission.component.scss'
})
export class CreatePermissionComponent {

  private readonly _router = inject(Router);
  private readonly _builder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);
  private readonly _accessControlService = inject(AccessControlService);

  public listResources = signal<ResourcesEnum[]>([...Object.values(ResourcesEnum)]);
  public listActions = signal<ActionsEnum[]>([...Object.values(ActionsEnum)]);
  public alertMessage = signal<boolean>(false);

  public listActionsSelected: ActionsEnum[] = [];

  public createPermissionForm: FormGroup = this._builder.group({
    name: this._builder.control("", [Validators.required, Validators.maxLength(100)]),
    resource: this._builder.control("", [Validators.required])
  });

  public createPermission(): void {

    if(this.createPermissionForm.invalid) {
      this.createPermissionForm.markAllAsTouched();
      return;
    }

    const jsonPermission: CreatePermission = {

      name: this.createPermissionForm.value.name,
      resource: this.createPermissionForm.value.resource,
      actions: this.listActionsSelected
    }

    this._accessControlService.createPermission(jsonPermission).pipe(
      catchError((error) => {

        if(error.status === HttpStatusCode.Conflict) {
          this.alertMessage.set(true);

          const timer = setTimeout(() => {
            this.alertMessage.set(false);
          }, 5000);
          clearTimeout(timer)
          return EMPTY;
        }
        return EMPTY;
      })
    ).subscribe(() => {
      this._alertService.success("Permiso Creado", "El permiso ha sido creado correctamente");
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
    return this.createPermissionForm.controls["name"];
  }

  get resource() {
    return this.createPermissionForm.controls["resource"];
  }
}
