import { Component, HostListener, inject, output, signal } from '@angular/core';
import { Sidenav, SidenavToggle } from '@core/interfaces/sidenav';
import { navbarData } from './navbar-data';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { SublevelMenuComponent } from './sublevel-menu.component';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, SublevelMenuComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  animations: [
    trigger("fadeInOut", [
      transition(":enter", [
        style({opacity: 0}),
        animate(".3s",
          style({opacity: 1})
        )
      ]),
      transition(":leave", [
        style({opacity: 1}),
        animate(".3s",
          style({opacity: 0})
        )
      ])
    ]),
    trigger("rotate", [
      transition(":enter", [
        animate("1s",
          keyframes([
            style({transform: "rotate(0deg)", offset: 0}),
            style({transform: "rotate(2turn)", offset: 1})
          ])
        )
      ])
    ])
  ]
})
export class SidenavComponent {

  public onToggleSideNav = output<SidenavToggle>();
  public collapsed = signal<boolean>(false);
  public screenWidth = signal<number>(0);
  public navData = signal<Sidenav[]>(navbarData);
  public multiple = signal<boolean>(false);

  private readonly _router = inject(Router);

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {

    this.screenWidth.update(value => window.innerWidth);

    if(this.screenWidth() <= 768){

      this.collapsed.set(false);
      this.onToggleSideNav.emit({collapsed: this.collapsed(), screenWidth: this.screenWidth()});
    }
  }

  ngOnInit(): void {
    this.screenWidth.update(value => window.innerWidth);
  }

  public toggleCollapse():void {
    this.collapsed.update(value => !value);
    this.onToggleSideNav.emit({collapsed: this.collapsed(), screenWidth: this.screenWidth()});
  }

  public closeSidenav():void{
    this.collapsed.set(false);
    this.onToggleSideNav.emit({collapsed: this.collapsed(), screenWidth: this.screenWidth()});
  }

  public handleClick(item: Sidenav):void {

    if(!this.multiple()){

      for(let modelItem of this.navData()){

        if(item !== modelItem && modelItem.expanded){
          modelItem.expanded = false;
        }
      }
    }

    item.expanded = !item.expanded;
  }

  public getActiveClass(data:Sidenav): string{
    return this._router.url.includes(data.routerLink) ? "active": "";
  }
}
