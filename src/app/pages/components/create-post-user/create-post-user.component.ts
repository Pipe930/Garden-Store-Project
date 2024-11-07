import { NgClass } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { CreatePost, Tag } from '@pages/interfaces/post';
import { PostService } from '@pages/services/post.service';

@Component({
  selector: 'app-create-post-user',
  standalone: true,
  imports: [RouterLink, NgClass, ReactiveFormsModule],
  templateUrl: './create-post-user.component.html',
  styleUrl: './create-post-user.component.scss'
})
export class CreatePostUserComponent implements OnInit {

  private readonly _postService = inject(PostService);
  private readonly _builder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);
  private readonly _router = inject(Router);

  public chips = signal<Tag[]>([]);
  public inputValue = signal<string>('');
  public listTags = signal<Tag[]>([]);
  public filteredSuggestions: Tag[] = [];
  public validTags = signal<boolean>(false);
  public imagePreview = viewChild.required<ElementRef>('imagePreview');
  public alertMessage = signal<boolean>(false);
  private imageBase64 = "";
  private nameImage = "";

  public createPostForm: FormGroup = this._builder.group({
    title: this._builder.control("", [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
    subtitle: this._builder.control("", [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
    file: this._builder.control("", Validators.required),
    published: this._builder.control(false),
    content: this._builder.control("", [Validators.required, Validators.minLength(5)]),
  })

  ngOnInit(): void {
    this._postService.getAllTags().subscribe(response => {
      this.listTags.set(response.data);
    });
  }

  public createPost(): void {

    if(this.createPostForm.invalid || this.chips().length === 0){
      this.createPostForm.markAllAsTouched();
      this.validTags.set(true);
      return;
    }

    const { file, ...form } = this.createPostForm.value;
    const [filename, imageBase64] = this.imageBase64.split(',');

    const postForm: CreatePost = {
      ...form,
      tags: this.chips(),
      file: imageBase64,
      filename: this.nameImage,
      typeFormat: filename.split(';')[0].split(':')[1]
    }

    this._postService.createPost(postForm).subscribe(() => {
      this._alertService.success("Publicación Creada", "La publicación ha sido creada correctamente");
      this._router.navigate(['/manage-posts/list'])
    }, (error) => {

      if(error.status === HttpStatusCode.Conflict){
        this.alertMessage.set(true);
        return;
      }
      this._alertService.error("Error", "Ha ocurrido un error al crear la publicación");
    })
  }

  public changeImage(event: Event) {

    const element = event.target as HTMLInputElement;
    const imagePreview = this.imagePreview().nativeElement;

    if (element instanceof HTMLInputElement && element.files && element.files.length > 0) {

      const archivo = element.files[0];
      const src = URL.createObjectURL(element.files[0]);

      this.nameImage = archivo.name;
      imagePreview.src = src;

      const reader = new FileReader();
      reader.readAsDataURL(archivo);

      reader.onload = () => {
        this.imageBase64 = reader.result as string;
      }

      return;
    }

    imagePreview.src = "/assets/imgs/upload-image_2023-04-11-023334_kxuh.png";
  }

  public onInputChange(event: Event) {

    this.inputValue.set((event.target as HTMLInputElement).value);

    this.filteredSuggestions = this.listTags()
      .filter(suggestion => suggestion.name.toLowerCase().includes(this.inputValue().toLowerCase()))
      .filter(suggestion => !this.chips().includes(suggestion));
  }

  public addChip(value: string) {

    const tagFind = this.listTags().find(tag => tag.name === value);

    if (value && tagFind && !this.chips().includes(tagFind)) {
      this.chips().push(tagFind);
      this.filteredSuggestions = [];
    }
    this.validTags.set(false);
  }

  public removeChip(tag: Tag) {
    this.chips.set(this.chips().filter(c => c !== tag));
  }

  get title() {
    return this.createPostForm.controls["title"];
  }

  get subtitle() {
    return this.createPostForm.controls["subtitle"];
  }

  get content() {
    return this.createPostForm.controls["content"];
  }

  get file() {
    return this.createPostForm.controls["file"];
  }
}
