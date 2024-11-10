import { PostService } from '@admin/services/post.service';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';


@Component({
  selector: 'app-update-tag',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './update-tag.component.html',
  styleUrl: './update-tag.component.scss'
})
export class UpdateTagComponent implements OnInit {

  private readonly _router = inject(Router);
  private readonly _builder = inject(FormBuilder);
  private readonly _postService = inject(PostService);
  private readonly _alertService = inject(AlertService);
  private readonly _activatedRouter = inject(ActivatedRoute);

  public alertMessage = signal<string>("");
  private idTag = this._activatedRouter.snapshot.params["id"];

  public updateTagForm: FormGroup = this._builder.group({
    name: this._builder.control("", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    description: this._builder.control("")
  });

  public updateTag(): void {

    if(this.updateTagForm.invalid){
      this.updateTagForm.markAllAsTouched();
      return;
    }

    this._postService.updateTag(this.updateTagForm.value, this.idTag).subscribe(() => {

      this._alertService.success("Etiqueta Modificada", "La etiqueta se actualizo correctamente");
      this._router.navigate(["/admin/posts/list"]);
    })
  }

  ngOnInit(): void {

    this._postService.getTgById(this.idTag).subscribe(response => {

      this.updateTagForm.get("name")?.setValue(response.data.name);
      this.updateTagForm.get("description")?.setValue(response.data.description);
      this.updateTagForm.updateValueAndValidity();
    })
  }

  get name(){
    return this.updateTagForm.controls["name"];
  }

  get description(){
    return this.updateTagForm.controls["description"];
  }
}
