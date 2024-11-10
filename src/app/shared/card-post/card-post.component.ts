import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { environment } from '@env/environment.development';
import { Post } from '@pages/interfaces/post';
import { PostService } from '@pages/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card-post',
  standalone: true,
  imports: [NgOptimizedImage, DatePipe, RouterLink],
  templateUrl: './card-post.component.html',
  styleUrl: './card-post.component.scss'
})
export class CardPostComponent {

  private readonly _postService = inject(PostService);
  private readonly _alertService = inject(AlertService);

  public post = input.required<Post>();
  public isActionsButtons = input<boolean>(false);
  public urlImages = signal<string>(environment.apiImages);

  public deletePost(slug: string): void{

    Swal.fire({
      title: "¿Estas seguro de eliminar esta publicación?",
      text: "Se borrara permanentemente y no podrás revertir esta acción",
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
