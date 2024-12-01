import { Directive, ElementRef, HostListener, inject, input, OnInit } from '@angular/core';
import { Progress } from '@core/interfaces/progress';
import { ProgressHelperService } from '@core/services/progress-helper.service';

@Directive({
  selector: '[progressStepNext], [progressStepPrev]',
  standalone: true
})
export class ProgressStepDirective implements OnInit {

  private readonly progressHelper = inject(ProgressHelperService);
  private readonly element = inject(ElementRef<HTMLButtonElement>);

  public next = input();
  public prev = input();

  private methods: Progress = {
    next: false,
    prev: false
  }

  @HostListener('click', ['$event']) listen(event: Event): void {
    this.progressHelper.eventHelper.next(this.methods);
  }

  ngOnInit(): void {
    this.initMethods();
  }

  private initMethods(): void {

    if('next' in this) {

      this.methods = {
        ...this.methods,
        next: true
      }
    }

    if('prev' in this) {

      this.methods = {
        ...this.methods,
        prev: true
      }
    }
  }

}
