import { Injectable } from '@angular/core';
import { Progress } from '@core/interfaces/progress';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressHelperService {

  public eventHelper = new Subject<Progress>();

  constructor() { }
}
