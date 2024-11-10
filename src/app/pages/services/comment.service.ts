import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Comment, CreateComment, ListCommentsResponse } from '@pages/interfaces/comment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/comments`;
  private listComments = new BehaviorSubject<Comment[]>([]);
  public listComments$ = this.listComments.asObservable();

  public getAllCommentsByPost(idPost: number): void {
    this._http.get<ListCommentsResponse>(`${this.urlApi}/post/${idPost}`).subscribe((response) => {
      this.listComments.next(response.data);
    });
  }

  public createComment(createComment: CreateComment): Observable<any> {
    return this._http.post(this.urlApi, createComment);
  }
}
