import { NgClass } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { Tag, UpdatePost } from '@pages/interfaces/post';
import { PostService } from '@pages/services/post.service';

@Component({
  selector: 'app-update-post-user',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './update-post-user.component.html',
  styleUrl: './update-post-user.component.scss'
})
export class UpdatePostUserComponent {

  private readonly _postService = inject(PostService);
  private readonly _builder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);
  private readonly _router = inject(Router);
  private readonly _activatedRouter = inject(ActivatedRoute);

  private readonly slugPost = this._activatedRouter.snapshot.params["slug"];
  public chips = signal<Tag[]>([]);
  public inputValue = signal<string>('');
  public listTags = signal<Tag[]>([]);
  public filteredSuggestions: Tag[] = [];
  public validTags = signal<boolean>(false);
  public imagePreview = viewChild.required<ElementRef>('imagePreview');
  public alertMessage = signal<boolean>(false);
  private newImageBase64 = "";
  private newImageName = "";
  private imageBase64 = "";
  private nameImage = "";
  private type = "";


  public updatePostForm: FormGroup = this._builder.group({
    title: this._builder.control("", [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
    subtitle: this._builder.control("", [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
    thumbnail: this._builder.control(""),
    published: this._builder.control(false),
    content: this._builder.control("", [Validators.required, Validators.minLength(5)]),
  })

  ngOnInit(): void {

    this._postService.getPostBySlug(this.slugPost).subscribe(response => {

      this.chips.set(response.data.tags);
      this.updatePostForm.get('title')?.setValue(response.data.title);
      this.updatePostForm.get('subtitle')?.setValue(response.data.subtitle);
      this.updatePostForm.get('content')?.setValue(response.data.content);
      this.updatePostForm.get('published')?.setValue(response.data.published);
      this.updatePostForm.updateValueAndValidity();
    });

    this._postService.getAllTags().subscribe(response => {
      this.listTags.set(response.data);
    });

    this._postService.getImagePost(this.slugPost).subscribe((image) => {

      this.imageBase64 = image.data.image;
      this.nameImage = image.data.filename;
      this.type = image.data.type;
      this.imagePreview().nativeElement.src = `data:${this.type};base64,${this.imageBase64}`;
    })
  }

  public updatePost(): void {

    if(this.updatePostForm.invalid || this.chips().length === 0){
      this.updatePostForm.markAllAsTouched();
      this.validTags.set(true);
      return;
    }

    let postForm: UpdatePost;
    const { thumbnail, ...form } = this.updatePostForm.value;

    if(thumbnail !== ""){

        const [filename, imageBase64] = this.newImageBase64.split(',');

        console.log("imagene nueva")
        console.log(this.newImageName);

        postForm = {
          ...form,
          tags: this.chips(),
          file: imageBase64,
          filename: this.newImageName,
          typeFormat: filename.split(';')[0].split(':')[1]
        }

    } else {

      console.log("imagen antigua")
      console.log(this.nameImage)

      postForm = {
        ...form,
        tags: this.chips(),
        file: this.imageBase64,
        filename: this.nameImage,
        typeFormat: this.type
      }
    }

    this._postService.updatePost(this.slugPost, postForm).subscribe(() => {
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

  public changeImage(evento: Event) {

    const imageProduct = evento.target as HTMLInputElement;
    const imagePreview = this.imagePreview().nativeElement;

    if (imageProduct instanceof HTMLInputElement && imageProduct.files && imageProduct.files.length > 0) {

      const archivo = imageProduct.files[0];
      const src = URL.createObjectURL(imageProduct.files[0]);

      this.newImageName = archivo.name;
      imagePreview.src = src;

      const reader = new FileReader();
      reader.readAsDataURL(archivo);

      reader.onload = () => {
        this.newImageBase64 = reader.result as string;
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
      this.validTags.set(false);
    }
  }

  public removeChip(tag: Tag) {
    this.chips.set(this.chips().filter(c => c !== tag));
  }

  get title() {
    return this.updatePostForm.controls["title"];
  }

  get subtitle() {
    return this.updatePostForm.controls["subtitle"];
  }

  get content() {
    return this.updatePostForm.controls["content"];
  }

  get file() {
    return this.updatePostForm.controls["file"];
  }
}
