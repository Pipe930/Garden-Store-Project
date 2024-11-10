import { Routes } from '@angular/router';
import { CreateTagComponent } from './create-tag/create-tag.component';
import { UpdateTagComponent } from './update-tag/update-tag.component';
import { ListPostsComponent } from './list-posts/list-posts.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { UpdatePostComponent } from './update-post/update-post.component';

export const routesPosts: Routes = [

  {
    path: "list",
    component: ListPostsComponent
  },
  {
    path: "post/create",
    component: CreatePostComponent
  },
  {
    path: "post/edit/:id",
    component: UpdatePostComponent
  },
  {
    path: "tag/create",
    component: CreateTagComponent
  },
  {
    path: "tag/edit/:id",
    component: UpdateTagComponent
  }
];
