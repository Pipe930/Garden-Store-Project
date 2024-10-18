import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@core/services/alert.service';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.scss'
})
export class ActivateComponent implements OnInit {

  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _alertService = inject(AlertService);

  private uuid: string = "";
  private token: string = "";

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {
      this.uuid = params['uuid'];
      this.token = params['token'];
    });
  }

  public activateAccount(): void {

    this._authService.activateAccount({uuid: this.uuid, token: this.token})
      .subscribe(() => {

        this._alertService.success('Activación de cuenta', 'Cuenta activada con exito');
        this._router.navigate(['auth/login']);
      }, () => {

        this._alertService.error('Activación de cuenta', 'Ocurrio un error al activar la cuenta');
      });
  }

}
