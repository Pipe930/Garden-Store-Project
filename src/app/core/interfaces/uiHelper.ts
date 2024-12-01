import { Status } from "@core/enums/uiState.enum";
import { ProgressHelperService } from "@core/services/progress-helper.service";

export interface ProgressList {
  stepIndex: number;
  status: string;
}

export class UiHelper {

  public itemProgressList: ProgressList[] = [];
  public activeIndex = 0;

  constructor(protected readonly progressHelper: ProgressHelperService) {}

  protected completeLastStep(): void {
    this.itemProgressList[this.activeIndex].status = Status.COMPLETED;
  }

  protected undoLastComplete(): void {
    this.itemProgressList[this.activeIndex].status = Status.IN_PROGRESS;
  }

  protected switchStatusNext(index: number): void {
    this.itemProgressList[this.activeIndex - 1].status = Status.COMPLETED;
    this.itemProgressList[index].status = Status.IN_PROGRESS;
  }

  protected switchStatusPrev(index: number): void {

    this.itemProgressList[this.activeIndex + 1].status = Status.PENDING;
    this.itemProgressList[index].status = Status.IN_PROGRESS;
  }
}
