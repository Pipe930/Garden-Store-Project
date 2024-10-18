import { Component, ElementRef, inject, input, output, Renderer2, Signal, signal, viewChild, ViewChild } from '@angular/core';
import { Navbar } from '@core/interfaces/navbar';
import { RouterLink } from '@angular/router';
import { SessionService } from '@core/services/session.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  private readonly _renderer2 = inject(Renderer2);
  private readonly _sessionService = inject(SessionService);

  public ObjectsNavbar = input.required<Array<Navbar>>();
  public eventThemeNavbar = output<boolean>();
  public containerNavbar: Signal<ElementRef> = viewChild.required("openDivNavbar");

  public themeNavbar: boolean = false;
  public modeOriginal:string = "Normal";
  public modeDark:string = "Oscuro";
  public mode:string = this.modeOriginal;
  public showClass:boolean = false;
  public sessionActivate = signal<boolean>(false);

  ngOnInit(): void {
    this.eventThemeNavbar.emit(this.themeNavbar);

    if(this._sessionService.validSession()){
      this._sessionService.changeTrueSession();
    } else {
      this._sessionService.changeFalseSession();
    }

    this.sessionActivate.set(this._sessionService.sessionActivate());
  }

  public openNavbar():void{

    let containerNavbar = this.containerNavbar().nativeElement;
    this._renderer2.addClass(containerNavbar, "visible");

  }

  public closeNavbar():void{

    let containerNavbar = this.containerNavbar().nativeElement;
    this._renderer2.removeClass(containerNavbar, "visible");
  }

  public themeChange():void{

    if(this.mode === this.modeOriginal){
      this.mode = this.modeDark;
    } else {
      this.mode = this.modeOriginal;
    }

    if(!this.themeNavbar){
      this.themeNavbar = true;
    } else {
      this.themeNavbar = false;
    }

    this.eventThemeNavbar.emit(this.themeNavbar);
  }

}
