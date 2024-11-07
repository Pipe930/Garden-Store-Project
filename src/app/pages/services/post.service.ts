import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { CreatePost, ListPostsResponse, ListTagResponse, PostResponse, UpdatePost } from '@pages/interfaces/post';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/posts`;

  public getAllPosts(): Observable<ListPostsResponse>{
    return this._http.get<ListPostsResponse>(this.urlApi);
  }

  public getAllPostsByUser(): Observable<ListPostsResponse>{
    return this._http.get<ListPostsResponse>(`${this.urlApi}/user`);
  }

  public getAllTags(): Observable<ListTagResponse>{
    return this._http.get<ListTagResponse>(`${this.urlApi}/tags`);
  }

  public getPostBySlug(slug: string): Observable<PostResponse>{
    return this._http.get<PostResponse>(`${this.urlApi}/slug/${slug}`);
  }

  public getImagePost(slug: string): Observable<any>{
    return this._http.get(`${this.urlApi}/image/${slug}`);
  }

  public createPost(postForm: CreatePost): Observable<any>{
    return this._http.post(`${this.urlApi}/user`, postForm);
  }

  public updatePost(slug: string, postForm: UpdatePost): Observable<any>{
    return this._http.put(`${this.urlApi}/user/${slug}`, postForm);
  }

  public deletePost(slug: string): Observable<any>{
    return this._http.delete(`${this.urlApi}/user/${slug}`);
  }
}
