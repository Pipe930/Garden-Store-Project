import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page404',
  standalone: true,
  imports: [RouterLink],
  template: `
  <div class="container-fluid container-page">
    <div class="container__fluid">
      <h2 class="fluid__title">404 | Pagina no Encontrada</h2>
      <div class="fluid__container-btn">
        <button class="btn btn-success" [routerLink]="['/']">Volver al Inicio</button>
      </div>
    </div>
  </div>
  `,
  styles: [
    `
    @import '../../../themes/variables.scss';

    .container-page{

      width: 100%;
      height: 100vh;
      min-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background-color: $color-success-900;

      .container__fluid{
        color: $color-light;
      }

      .fluid__container-btn{
        margin-top: 1.2rem;
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
    `
  ]
})
export class Page404Component {

}
