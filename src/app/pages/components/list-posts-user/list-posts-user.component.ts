import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { environment } from '@env/environment.development';
import { Post } from '@pages/interfaces/post';
import { PostService } from '@pages/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-posts-user',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './list-posts-user.component.html',
  styleUrl: './list-posts-user.component.scss'
})
export class ListPostsUserComponent implements OnInit {

  private readonly _postService = inject(PostService);
  private readonly _alertService = inject(AlertService);

  public urlImages = signal<string>(environment.apiImages);
  public listPosts = signal<Post[]>([]);

  ngOnInit(): void {
    this._postService.getAllPostsByUser().subscribe((response) => {
      this.listPosts.set(response.data);
    })
  }

  public deletePost(slug: string): void{

    Swal.fire({
      title: "¿Estas seguro de eliminar tu cuenta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        this._postService.deletePost(slug).subscribe(() => {
          this._alertService.success("Post Eliminado", "Post eliminado correctamente");
        });
      }
    });
  }
}
