import { Directive, ElementRef, inject, input, OnChanges } from '@angular/core';
import { ActionsEnum } from '@core/enums/actions.enum';

@Directive({
  selector: '[validCheckedInput]',
  standalone: true
})
export class ValidCheckedInputDirective implements OnChanges {

  private element: ElementRef<HTMLInputElement> = inject(ElementRef);
  public listActions = input.required<ActionsEnum[]>();

  ngOnChanges(): void {

    this.listActions().forEach((action) => {
      if(action === this.element.nativeElement.value) {
        this.element.nativeElement.checked = true;
      }
    })
  }
}
