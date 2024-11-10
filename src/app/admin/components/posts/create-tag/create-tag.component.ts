import { PostService } from '@admin/services/post.service';
import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';

@Component({
  selector: 'app-create-tag',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './create-tag.component.html',
  styleUrl: './create-tag.component.scss'
})
export class CreateTagComponent {

  private readonly _router = inject(Router);
  private readonly _builder = inject(FormBuilder);
  private readonly _postService = inject(PostService);
  private readonly _alertService = inject(AlertService);

  public alertMessage = signal<string>("");

  public createTagForm: FormGroup = this._builder.group({
    name: this._builder.control("", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    description: this._builder.control("")
  });

  public createTag(): void {

    if(this.createTagForm.invalid){
      this.createTagForm.markAllAsTouched();
      return;
    }

    this._postService.createTag(this.createTagForm.value).subscribe(() => {

      this._alertService.success("Etiqueta Creada", "La etiqueta se ha creado correctamente");
      this._router.navigate(["/admin/posts/list"]);
    })

  }

  get name(){
    return this.createTagForm.controls["name"];
  }

  get description(){
    return this.createTagForm.controls["description"];
  }

}
