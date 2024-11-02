import { CategoryService } from '@admin/services/category.service';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { Category } from '@pages/interfaces/category';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.scss'
})
export class UpdateCategoryComponent implements OnInit {

  public idCategory = "";
  public category = signal<Category>({
    name: "",
    description: "",
    slug: "",
    idCategory: 0
  });

  private readonly _builder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _activeRouter = inject(ActivatedRoute);
  private readonly _categoryService = inject(CategoryService);
  private readonly _alertService = inject(AlertService);

  public formUpdateCategory: FormGroup = this._builder.group({
    name: this._builder.control("", [Validators.required, Validators.maxLength(40), Validators.minLength(4)]),
    description: this._builder.control("", Validators.maxLength(255))
  })

  public updateCategory():void{

    if(this.formUpdateCategory.invalid){

      this.formUpdateCategory.markAllAsTouched();
      return;
    }

    this._categoryService.updateCategory(this.formUpdateCategory.value, this.idCategory).pipe(
      catchError(() => {
        this._alertService.error("Error", "No se actualizo la categoria");
        return of();
      })
    ).subscribe(result => {

      this._alertService.success("Categoria Actualizada", "La categoria se actualizo con exito");
      this._router.navigate(["/admin/categories/list"]);
    })
  }

  ngOnInit(): void {

    this.idCategory = this._activeRouter.snapshot.paramMap.get("id")!;

    if(this.idCategory === null) this._router.navigate(["/admin/categories/list"]);

    this._categoryService.getCategoryById(this.idCategory).subscribe(result => {
      this.category.set(result.data);
      this.formUpdateCategory.get("name")?.setValue(result.data.name);
      this.formUpdateCategory.get("description")?.setValue(result.data.description);
      this.formUpdateCategory.updateValueAndValidity();
    });
  }

  get name(){
    return this.formUpdateCategory.controls["name"];
  }

  get description(){
    return this.formUpdateCategory.controls["description"];
  }
}
