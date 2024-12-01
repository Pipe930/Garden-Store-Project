import { NgClass } from '@angular/common';
import { AfterContentInit, Component, ContentChildren, Input, OnInit, QueryList, signal } from '@angular/core';
import { Status } from '@core/enums/uiState.enum';
import { Progress } from '@core/interfaces/progress';
import { UiHelper } from '@core/interfaces/uiHelper';
import { ProgressHelperService } from '@core/services/progress-helper.service';
import { ProgressStepComponent } from '@shared/progress-step/progress-step.component';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [NgClass],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent extends UiHelper implements OnInit, AfterContentInit {

  public itemLength = signal<number>(0);

  @Input() public set selectedIndex(value: number) {
    this.activeIndex = value || 0;
  }

  @ContentChildren(ProgressStepComponent) public steps!: QueryList<ProgressStepComponent>;

  constructor(protected override readonly progressHelper: ProgressHelperService) {
    super(progressHelper);
  }

  ngOnInit(): void {
    this.progressHelper.eventHelper.subscribe((progress: Progress) => {
      if (progress.next) {
        this.increaseStep();
      }

      if (progress.prev) {
        this.decreaseStep();
      }
    });
  }

  ngAfterContentInit(): void {
    this.initProgress(this.progressSteps.length);
    this.setActiveActiveStep(this.activeIndex);
    this.initStepIndex();
  }

  public increaseStep(): void {
    if (
      this.activeIndex === this.itemLength() - 1 &&
      this.itemProgressList[this.activeIndex].status !== Status.COMPLETED
    ) {
      this.completeLastStep();
    }

    if (this.activeIndex < this.itemLength() - 1) {
      this.activeIndex++;
      this.switchStatusNext(this.activeIndex);
      this.setActiveActiveStep(this.activeIndex);
    }
  }

  public decreaseStep(): void {

    if (
      this.activeIndex === this.itemLength() - 1 &&
      this.itemProgressList[this.activeIndex].status === Status.COMPLETED
    ) {
      this.undoLastComplete();
    } else {
      if (this.activeIndex > 0) {
        this.activeIndex--;
        this.switchStatusPrev(this.activeIndex);
        this.setActiveActiveStep(this.activeIndex);
      }
    }
  }

  private setActiveActiveStep(index: number): void {
    if (this.stepsExists) {
      this.removeActiveStep();
      this.updateActiveStep(index);
    }
  }

  private updateActiveStep(index: number) {
    this.progressSteps[index].activeState = this.progressSteps[index];
  }

  private removeActiveStep() {
    this.progressSteps.map((step) => {
      if (step.isActive) {
        step.isActive = false;
      }
    });
  }

  private initStepIndex() {
    this.progressSteps.forEach((step, i) => (step.stepIndex = i));
  }

  public get activeStep(): ProgressStepComponent {
    return this.progressSteps[this.activeIndex];
  }

  private get stepsExists(): boolean {
    return this.progressSteps && Array.isArray(this.progressSteps);
  }

  private get progressSteps(): ProgressStepComponent[] {
    return this.steps.toArray();
  }

  protected generateProgressArray(length: number): any[] {
    return [...Array(length).keys()].map((key) => {
      return {
        stepIndex: key,
        status: key === this.activeIndex ? Status.IN_PROGRESS : Status.PENDING,
      };
    });
  }

  private initProgress(value: number): void {
    this.itemLength.set(value || 0);
    this.itemProgressList = this.generateProgressArray(this.itemLength());
  }
}
