import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { CreatePost, CreateReaction, ListPostsResponse, ListTagResponse, Post, PostResponse, ReactionResponse, UpdatePost } from '@pages/interfaces/post';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/posts`;
  private listPosts = new BehaviorSubject<Post[]>([]);
  public listPosts$ = this.listPosts.asObservable();
  private listPostsByUser = new BehaviorSubject<Post[]>([]);
  public listPostsByUser$ = this.listPostsByUser.asObservable();

  public currentPage = new Subject<number>();
  public totalPages = new Subject<number>();
  public limit = 10;

  public getAllPosts(): void{
    this._http.get<ListPostsResponse>(`${this.urlApi}?limit=${this.limit}`).subscribe((response) => {
      this.listPosts.next(response.data);
      this.totalPages.next(response.totalPages);
      this.currentPage.next(response.currentPage);
    });
  }

  public getPostsPage(page: number): void {
    this._http.get<ListPostsResponse>(`${this.urlApi}?limit=${this.limit}&page=${page}`).subscribe((response) => {
      this.listPosts.next(response.data);
      this.totalPages.next(response.totalPages);
      this.currentPage.next(response.currentPage);
    });
  }

  public searchPost(title: string): void {
    this._http.get<ListPostsResponse>(`${this.urlApi}/search?title=${title}`).subscribe((response) => {
      this.listPosts.next(response.data);
    });
  }

  public filterPost(idTag: number): void {
    this._http.get<ListPostsResponse>(`${this.urlApi}/filter/${idTag}`).subscribe((response) => {
      this.listPosts.next(response.data);
    });
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

  public likePost(createReaction: CreateReaction): Observable<any>{
    return this._http.post(`${this.urlApi}/like`, createReaction);
  }

  public dislikePost(createReaction: CreateReaction): Observable<any>{
    return this._http.post(`${this.urlApi}/dislike`, createReaction);
  }

  public getReactionUser(idPost: number): Observable<ReactionResponse>{
    return this._http.get<ReactionResponse>(`${this.urlApi}/reaction/${idPost}`);
  }
}
