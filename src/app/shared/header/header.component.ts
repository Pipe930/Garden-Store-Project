import { Component, input } from '@angular/core';
import { IonBackButton, IonButtons, IonHeader, IonSearchbar, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonButtons,
    IonBackButton,
    IonToolbar,
    IonSearchbar,
    IonTitle
  ]
})
export class HeaderComponent {

  public title = input.required<string>();
  public backButton = input.required<string>();
  public isSearchBar = input<boolean>(false);

}
