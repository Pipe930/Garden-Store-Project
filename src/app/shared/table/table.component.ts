import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TableColumns } from '@core/interfaces/table';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  public tableColumns = input.required<TableColumns[]>();
  public dataRows = input.required<any[]>();
  public showActionButton = input<boolean>(false);
  public messageNoContent = input<string>("");
  public eventPages = output<boolean>();
  public eventEdit = output<any>();

  public onEdit(object: any):void{

    this.eventEdit.emit(object);
  }
}
