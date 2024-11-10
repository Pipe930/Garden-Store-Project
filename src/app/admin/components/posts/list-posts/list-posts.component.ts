import { postColumns } from '@admin/interfaces/post-table';
import { Tag, tagColumns } from '@admin/interfaces/tag';
import { PostService } from '@admin/services/post.service';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableColumns } from '@core/interfaces/table';
import { Post } from '@pages/interfaces/post';
import { TableComponent } from '@shared/table/table.component';

@Component({
  selector: 'app-list-posts',
  standalone: true,
  imports: [RouterLink, TableComponent],
  templateUrl: './list-posts.component.html',
  styleUrl: './list-posts.component.scss'
})
export class ListPostsComponent implements OnInit {

  private readonly _router = inject(Router);
  private readonly _postService = inject(PostService);

  public listPosts = signal<Post[]>([]);
  public listTags = signal<Tag[]>([]);

  public columnsPost = signal<TableColumns[]>(postColumns);
  public columnsTag = signal<TableColumns[]>(tagColumns);
  public isLoadingPost = signal<boolean>(false);
  public isLoadingTag = signal<boolean>(false);


  ngOnInit(): void {

    this._postService.getAllPosts().subscribe((response) => {
      if(response.statusCode === HttpStatusCode.Ok) this.listPosts.set(response.data);
      this.isLoadingPost.set(true);
    });

    this._postService.getAllTags().subscribe((response) => {
      if(response.statusCode === HttpStatusCode.Ok) this.listTags.set(response.data);
      this.isLoadingTag.set(true);
    });
  }

  public editPost(post: Post): void {
    this._router.navigate(['admin/posts/post/edit', post.idPost]);
  }

  public editTag(tag: Tag): void {
    this._router.navigate(['admin/posts/tag/edit', tag.idTag]);
  }
}
