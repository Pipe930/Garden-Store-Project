import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionService } from '@core/services/session.service';
import { environment } from '@env/environment.development';
import { Post, Tag } from '@pages/interfaces/post';
import { PostService } from '@pages/services/post.service';

@Component({
  selector: 'app-list-posts',
  standalone: true,
  imports: [RouterLink, DatePipe, NgOptimizedImage],
  templateUrl: './list-posts.component.html',
  styleUrl: './list-posts.component.scss'
})
export class ListPostsComponent implements OnInit {

  private readonly _sessionService = inject(SessionService);
  private readonly _postService = inject(PostService);
  public urlImages = signal<string>(environment.apiImages);

  public validSession = signal<boolean>(false);
  public listTags = signal<Tag[]>([]);
  public listPosts = signal<Post[]>([]);

  ngOnInit(): void {
    this.validSession.set(this._sessionService.validSession());

    this._postService.getAllTags().subscribe((response) => {
      this.listTags.set(response.data);
    });

    this._postService.getAllPosts().subscribe((response) => {
      this.listPosts.set(response.data);
    })
  }

}
