import { UserInterface } from '@admin/interfaces/user';
import { userColumns } from '@admin/interfaces/user-table';
import { UserService } from '@admin/services/user.service';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableColumns } from '@core/interfaces/table';
import { TableComponent } from '@shared/table/table.component';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [TableComponent, RouterLink],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss'
})
export class ListUsersComponent implements OnInit {

  private readonly _userService = inject(UserService);
  private readonly _router = inject(Router);

  public columns = signal<TableColumns[]>(userColumns);
  public listUsers = signal<UserInterface[]>([]);

  ngOnInit(): void {

    this._userService.getAllUsers().subscribe(result => {
      if(result.statusCode === HttpStatusCode.Ok) this.listUsers.set(result.data);
    });
  }

  public editUser(event: UserInterface):void {
    this._router.navigate(["/admin/users/edit", event.idUser]);
  }

}
