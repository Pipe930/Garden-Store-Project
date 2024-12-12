import { DecimalPipe } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { SessionService } from '@core/services/session.service';
import { Subcription, subcriptionObject } from '@pages/interfaces/subcription';
import { SubcriptionService } from '@pages/services/subcription.service';
import { catchError, EMPTY } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent implements OnInit {

  private readonly _subcriptionService = inject(SubcriptionService);
  private readonly _sessionService = inject(SessionService);
  private readonly _alertService = inject(AlertService);
  private readonly _router = inject(Router);

  public subcription = signal<Subcription>(subcriptionObject);
  public subscriptionMount = signal<number>(3990);

  ngOnInit(): void {


    if(this._sessionService.validSession()){
      this._subcriptionService.getSubcription();
      this._subcriptionService.subcription$.subscribe(result =>{
        this.subcription.set(result);
      })
    }
  }

  public createSubcription():void{

    if(this._sessionService.validSession()){

      const json = {

        mount: this.subscriptionMount()
      }

      this._subcriptionService.createSubcription(json).pipe(
        catchError((error) => {

          if(error.error.statusCode === HttpStatusCode.Conflict){

            this._subcriptionService.renovateSubcription(json).subscribe(() => {
              this._alertService.success("Suscripción Renovada", "Subscripcion renovada con exito");
              this._subcriptionService.getSubcription();
            })
          }

          return EMPTY;
        })
      ).subscribe(() => {

        this._alertService.success("Suscripción Exitosa", "La suscripción se realizo con exito");
        this._subcriptionService.getSubcription();
      })
    } else {

      this._alertService.info("Inicia Sesion", "Para poder suscribirse tienes que iniciar sesión con tu cuenta");
      this._router.navigate(["auth/login"]);
    }
  }

  public cancelSubcription():void{

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn-success",
        cancelButton: "btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "¿Estas Seguro?",
      text: "Estas seguro de cancelar tu suscripción?, ya no resiviras nuestros beneficios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, Cancelar",
      cancelButtonText: "No, Mantener",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: "Suscripción Cancelada",
          text: "Tu suscripción a sido cance3990lada con exito",
          icon: "success"
        });
        this._subcriptionService.cancelSubcription().subscribe(() => {

          this._subcriptionService.getSubcription();
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Suscripción Mantenida",
          text: "No se a realizado la operación de cancelación",
          icon: "error"
        });
      }
    });

  }
}
