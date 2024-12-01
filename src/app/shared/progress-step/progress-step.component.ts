import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-progress-step',
  standalone: true,
  imports: [],
  templateUrl: './progress-step.component.html',
  styleUrl: './progress-step.component.scss'
})
export class ProgressStepComponent {

  public stepIndex: number = 0;

  @HostBinding('class.activeStep')
  public isActive = false;

  @Input() public set activeState(step: any) {
    this.isActive = step === this;
  }
}
