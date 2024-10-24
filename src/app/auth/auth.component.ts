import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="container-auth">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
    @import '../../themes/variables.scss';

    .container-auth{
      width: 100%;
      min-height: 100vh;
      background: linear-gradient(150deg, $color-success-200, $color-success);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    `
  ]
})
export class AuthComponent {


}
