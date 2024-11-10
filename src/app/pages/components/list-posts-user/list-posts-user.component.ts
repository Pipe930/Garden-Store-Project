import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@env/environment.development';
import { Post } from '@pages/interfaces/post';
import { PostService } from '@pages/services/post.service';
import { CardPostComponent } from '@shared/card-post/card-post.component';

@Component({
  selector: 'app-list-posts-user',
  standalone: true,
  imports: [RouterLink, CardPostComponent],
  templateUrl: './list-posts-user.component.html',
  styleUrl: './list-posts-user.component.scss'
})
export class ListPostsUserComponent implements OnInit {

  private readonly _postService = inject(PostService);

  public urlImages = signal<string>(environment.apiImages);
  public listPosts = signal<Post[]>([]);

  ngOnInit(): void {
    this._postService.getAllPostsByUser().subscribe((response) => {
      this.listPosts.set(response.data);
    })
  }
}
