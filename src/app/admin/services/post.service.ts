import { CreatePost, PostResponse } from '@admin/interfaces/post-table';
import { CreateTag, ListTagsResponse, TagResponse } from '@admin/interfaces/tag';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { ListPostsResponse } from '@pages/interfaces/post';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly _http = inject(HttpClient);
  private urlApi = `${environment.api}/posts`;

  public getAllPosts(): Observable<ListPostsResponse>{
    return this._http.get<ListPostsResponse>(`${this.urlApi}/admin`);
  }

  public createPost(post: CreatePost): Observable<any>{
    return this._http.post(this.urlApi, post);
  }

  public getAllTags(): Observable<ListTagsResponse>{
    return this._http.get<ListTagsResponse>(`${this.urlApi}/tags`);
  }

  public createTag(tag: CreateTag): Observable<any>{
    return this._http.post(`${this.urlApi}/tags`, tag);
  }

  public updateTag(tag: CreateTag, id: string): Observable<any>{
    return this._http.put(`${this.urlApi}/tags/${id}`, tag);
  }

  public getTgById(id: string): Observable<TagResponse>{
    return this._http.get<TagResponse>(`${this.urlApi}/tags/${id}`);
  }

  public getPostById(id: string): Observable<PostResponse>{
    return this._http.get<PostResponse>(`${this.urlApi}/post/${id}`);
  }

  public updatePost(post: CreatePost, id: string): Observable<any>{
    return this._http.put(`${this.urlApi}/post/${id}`, post);
  }

  public getImagePost(slug: string): Observable<any>{
    return this._http.get(`${this.urlApi}/image/${slug}`);
  }
}
