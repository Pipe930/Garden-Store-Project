import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { SearchInterface } from '@core/interfaces/search';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  public nameProduct = viewChild.required<ElementRef>("searchNameProduct");
  public selectCategory = viewChild.required<ElementRef>("selectIdCategory");
  public inputSearch = output<SearchInterface>();
  public filterSearch = output<string>();
  public listModels = input.required<any[]>();

  public searchProduct():void {

    const nameProduct = this.nameProduct().nativeElement.value;
    const idCategory = this.selectCategory().nativeElement.value;

    this.inputSearch.emit({nameProduct, idCategory});
  }
}
