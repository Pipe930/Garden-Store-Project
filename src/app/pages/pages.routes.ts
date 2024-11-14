import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListProductsComponent } from './components/list-products/list-products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { authenticationGuard } from '../core/guards/authentication.guard';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { PurchaseConfirmComponent } from './components/purchase-confirm/purchase-confirm.component';
import { AccountComponent } from './components/account/account.component';
import { ListPostsComponent } from './components/list-posts/list-posts.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { ListPostsUserComponent } from './components/list-posts-user/list-posts-user.component';
import { CreatePostUserComponent } from './components/create-post-user/create-post-user.component';
import { UpdatePostUserComponent } from './components/update-post-user/update-post-user.component';
import { ListProductsOfferComponent } from './components/list-products-offer/list-products-offer.component';
import { ContactComponent } from './components/contact/contact.component';

export const routesPages: Routes = [

  {
    path: "",
    loadComponent: () => import("./pages.component").then(c => c.PagesComponent),
    children: [

      {
        path: "",
        component: HomeComponent
      },
      {
        path: "products",
        component: ListProductsComponent
      },
      {
        path: "products/offer",
        component: ListProductsOfferComponent
      },
      {
        path: "product/:slug",
        component: ProductDetailComponent
      },
      {
        path: "cart",
        component: CartComponent,
        canActivate: [authenticationGuard]
      },
      {
        path: "purchase",
        component: PurchaseComponent,
        canActivate: [authenticationGuard]
      },
      {
        path: "purchase-confirm",
        component: PurchaseConfirmComponent,
        canActivate: [authenticationGuard]
      },
      {
        path: "account",
        component: AccountComponent,
        canActivate: [authenticationGuard]
      },
      {
        path: "blog",
        component: ListPostsComponent
      },
      {
        path: "detail-blog/:slug",
        component: PostDetailComponent
      },
      {
        path: "contact",
        component: ContactComponent
      },
      {
        path: "manage-posts",
        children: [
          {
            path: "list",
            component: ListPostsUserComponent
          },
          {
            path: "create",
            component: CreatePostUserComponent
          },
          {
            path: 'edit/:slug',
            component: UpdatePostUserComponent
          }
        ],
        canActivate: [authenticationGuard]

      }
    ]
  }
];
