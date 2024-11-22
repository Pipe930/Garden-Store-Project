import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { CreateReview, ListReviewResponse, Review } from '@pages/interfaces/review';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/reviews`;
  private listReviews = new BehaviorSubject<Review[]>([]);
  public listReviews$ = this.listReviews.asObservable();

  public createReview(review: CreateReview): Observable<any> {
    return this._http.post(this.urlApi, review);
  }

  public getReviewsProduct(idProduct: number): void {
    this._http.get<ListReviewResponse>(`${this.urlApi}/product/${idProduct}`).subscribe(response => {
      if(response.statusCode === HttpStatusCode.Ok){
        this.listReviews.next(response.data);
      } else {
        this.listReviews.next([]);
      }
    });
  }
}
