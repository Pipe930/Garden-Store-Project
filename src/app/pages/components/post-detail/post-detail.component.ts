import { DatePipe, NgClass, TitleCasePipe, ViewportScroller } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReactionEnum } from '@core/enums/reaction.enum';
import { AlertService } from '@core/services/alert.service';
import { SessionService } from '@core/services/session.service';
import { environment } from '@env/environment.development';
import { Comment, CreateComment } from '@pages/interfaces/comment';
import { Post, postJson } from '@pages/interfaces/post';
import { CommentService } from '@pages/services/comment.service';
import { PostService } from '@pages/services/post.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, NgClass, TitleCasePipe],
  templateUrl: './post-detail.component.html'
})
export class PostDetailComponent implements OnInit {

  private readonly _postService = inject(PostService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _viewportScroller = inject(ViewportScroller);
  private readonly _builder = inject(FormBuilder);
  private readonly _commentService = inject(CommentService);
  private readonly _alertService = inject(AlertService);
  private readonly _sessionService = inject(SessionService);

  public btnLike = viewChild.required<ElementRef>('btnLike');
  public btnDislike = viewChild.required<ElementRef>('btnDislike');
  public postFind = signal<Post>(postJson);
  public comments = signal<Comment[]>([]);
  public urlImage = signal<string>('');
  public selectedOption = signal<string | null>(null);

  public slugPost = this._activatedRoute.snapshot.params["slug"];

  public createCommentForm: FormGroup = this._builder.group({
    comment: this._builder.control("", Validators.required)
  });

  ngOnInit(): void {
    this._viewportScroller.scrollToPosition([0, 0]);
    this._postService.getPostBySlug(this.slugPost).subscribe((response) => {

      this.postFind.set(response.data);
      this.urlImage.set(environment.apiImages + response.data.thumbnail);
      this._commentService.getAllCommentsByPost(this.postFind().idPost);
      this._commentService.listComments$.subscribe((response) => {
        this.comments.set(response);
      });

      if(this._sessionService.validSession()){
        this._postService.getReactionUser(this.postFind().idPost).subscribe((response) => {

          if(response.data.reaction === ReactionEnum.LIKE){

            const element = this.btnLike().nativeElement as HTMLInputElement;
            element.checked = true;
            this.selectedOption.set('like');
          } else if(response.data.reaction === ReactionEnum.DISLIKE){

            const element = this.btnDislike().nativeElement as HTMLInputElement;
            element.checked = true;
            this.selectedOption.set('dislike');
          }
        });
      }
    });

  }

  public createComment(): void {

    if(!this._sessionService.validSession()){
      this._alertService.info("Inicia Sesión", "Debes iniciar sesión para poder comentar");
      return;
    }

    if(this.createCommentForm.invalid){
      this.createCommentForm.markAllAsTouched();
      return;
    }

    const jsonComment: CreateComment = {
      comment: this.createCommentForm.value.comment,
      idPost: this.postFind().idPost
    }

    this._commentService.createComment(jsonComment).subscribe(() => {
      this.createCommentForm.reset();
      this._commentService.getAllCommentsByPost(this.postFind().idPost);
      this._alertService.success("Comentario Creado", "El comentario se ha creado correctamente");
    })
  }

  public toggleSelection(option: string): void {

    if(!this._sessionService.validSession()){
      this._alertService.info("Inicia Sesión", "Debes iniciar sesión para poder reaccionar");
      return;
    }

    this.selectedOption.set(this.selectedOption() === option ? null : option);

    if(option === 'like'){
      this.likePost();
    } else if(option === 'dislike'){
      this.dislikePost();
    }
  }

  public likePost(): void {

    const jsonReaction = {
      idPost: this.postFind().idPost,
      reaction: ReactionEnum.LIKE
    }

    this._postService.likePost(jsonReaction).subscribe(() => {
      console.log("Like");
    })
  }

  public dislikePost(): void {

    const jsonReaction = {
      idPost: this.postFind().idPost,
      reaction: ReactionEnum.DISLIKE
    }

    this._postService.dislikePost(jsonReaction).subscribe(() => {
      console.log("dislike");
    })
  }

  get comment() {
    return this.createCommentForm.controls["comment"]
  }
}
