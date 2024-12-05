import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseCategory } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.api}/categories`;

  public getCategories(): Observable<ResponseCategory> {
    return this.http.get<ResponseCategory>(this.apiUrl);
  }
}
