import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Sidenav } from '@core/interfaces/sidenav';

@Component({
  selector: 'app-sublevel-menu',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive],
  template: `

    @let dataVar = data();
    @let collapsedVar = collapsed();
    @let multipleVar = multiple();

    @if(collapsedVar && dataVar.items && dataVar.items.length > 0){
      <ul class="sublevel-nav"
      [@submenu]="collapsedVar
      ? {value: 'visible', params: {transitionParams: '.4s cubic-bezier(0.86, 0, 0.07, 1)', height: '*'}}
      :{value: 'hidden', params: {transitionParams: '.4s cubic-bezier(0.86, 0, 0.07, 1)', height: '0'}}"
      >
        @for (item of dataVar.items; track $index) {
          <li class="sublevel-nav__item">

            @if (item.items && item.items.length > 0) {
              <a class="sublevel-nav__link"
              (click)="handleClick(item)"
              [ngClass]="getActiveClass(item)"
              >

                <i class="bx bxs-circle sublevel-nav__icon"></i>
                @if(collapsedVar) {
                  <span class="sublevel-nav__text">{{item.label}}</span>
                }
                @if(item.items && collapsedVar){
                  <i class="sublevel-nav__menu-collapse-icon"
                  [ngClass]="!item.expanded ? 'bx bx-chevron-right':'bx bx-chevron-down'"
                  ></i>
                }
              </a>
            }

            @if(!item.items || (item.items && item.items.length === 0)){

              <a class="sublevel-nav__link"
              [routerLink]="[item.routerLink]"
              routerLinkActive="active-sublevel"
              [routerLinkActiveOptions]="{exact: true}"
              >
                <i class="bx bxs-circle sublevel-nav__icon"></i>
                @if(collapsedVar) {
                  <span class="sublevel-nav__text">{{item.label}}</span>
                }
              </a>
            }

            @if(item.items && item.items.length > 0){

              <app-sublevel-menu
              [data]="item"
              [collapsed]="collapsedVar"
              [multiple]="multipleVar"
              [expanded]="item.expanded"
              />
            }
          </li>
        }
      </ul>
    }
  `,
  styleUrl: './sidenav.component.scss',
  animations: [

    trigger("submenu", [
      state("hidden", style({
        height: "0",
        overflow: "hidden"
      })),
      state("visible", style({
        height: "*"
      })),
      transition("visible => hidden, hidden => visible", [style({overflow: "hidden"}),
        animate("{{transitionParams}}")]),
      transition("void => *", animate(0))
    ])
  ]
})
export class SublevelMenuComponent {

  public data = input.required<Sidenav>();
  public collapsed = input.required<boolean>();
  public expanded = input<boolean | undefined>();
  public multiple = input.required<boolean>();

  private readonly _router = inject(Router);

  public handleClick(item:Sidenav):void {

    if(!this.multiple()){
      /*
      if(this.data().items && this.data().items.length > 0){

        for(let modelItem of this.data().items){

          if(item !== modelItem && modelItem.expanded){

            modelItem.expanded = false;
          }
        }
      }
      */
    }

    item.expanded = !item.expanded;
  }

  public getActiveClass(item: Sidenav): string{
    return item.expanded && this._router.url.includes(item.routerLink) ? "active-sublevel": "";
  }
}
