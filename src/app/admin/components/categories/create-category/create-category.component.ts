import { CategoryService } from '@admin/services/category.service';
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.scss'
})
export class CreateCategoryComponent {

  private readonly _builder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _categoryService = inject(CategoryService);
  private readonly _alertService = inject(AlertService);

  public formCategory: FormGroup = this._builder.group({
    name: this._builder.control("", [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
    description: this._builder.control("", Validators.maxLength(255))
  });

  public createCategory():void{

    if(this.formCategory.invalid){

      this.formCategory.markAllAsTouched();
      return;
    }

    this._categoryService.createCategory(this.formCategory.value).pipe(
      catchError((error) => {
        this._alertService.error("Error", "La categoria no se creo con exito");
        return of();
      })
    ).subscribe(result => {
      this._alertService.success("Categoria Creada", "La categoria se creo con exito");
      this._router.navigate(["/admin/categories/list"]);
    })
  }

  get name(){
    return this.formCategory.controls["name"];
  }

  get description(){
    return this.formCategory.controls["description"];
  }
}
