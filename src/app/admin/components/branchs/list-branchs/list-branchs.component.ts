import { Branch, branchColumns } from '@admin/interfaces/branch';
import { BranchService } from '@admin/services/branch.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableColumns } from '@core/interfaces/table';
import { TableComponent } from '@shared/table/table.component';

@Component({
  selector: 'app-list-branchs',
  standalone: true,
  imports: [RouterLink, TableComponent],
  templateUrl: './list-branchs.component.html',
  styleUrl: './list-branchs.component.scss'
})
export class ListBranchsComponent implements OnInit {

  private readonly _router = inject(Router);
  private readonly _branchService = inject(BranchService);

  public isLoading = signal<boolean>(false);
  public listBranchs = signal<Branch[]>([]);
  public columnsBranch = signal<TableColumns[]>(branchColumns);

  ngOnInit(): void {
      this._branchService.getAllBranchs().subscribe(response => {
        this.listBranchs.set(response.data);
        this.isLoading.set(true);
      })
  }

  public editBranch(branch: Branch): void {
    this._router.navigate(['/admin/branchs/edit', branch.idBranch]);
  }
}
