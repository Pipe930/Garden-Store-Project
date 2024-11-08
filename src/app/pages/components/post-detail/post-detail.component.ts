import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment.development';
import { Post, postJson } from '@pages/interfaces/post';
import { PostService } from '@pages/services/post.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit {

  private readonly _postService = inject(PostService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  public postFind = signal<Post>(postJson);
  public urlImage = signal<string>('');

  public slugPost = this._activatedRoute.snapshot.params["slug"];

  ngOnInit(): void {

    this._postService.getPostBySlug(this.slugPost).subscribe((response) => {
      this.postFind.set(response.data);

      this.urlImage.set(environment.apiImages + response.data.thumbnail);
    })
  }
}
