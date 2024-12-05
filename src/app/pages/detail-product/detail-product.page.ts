import { Component, inject, OnInit, signal } from '@angular/core';
import { Images, Product, productJson } from 'src/app/core/interfaces/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { environment } from 'src/environments/environment';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { add, remove, star } from 'ionicons/icons';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { CartService } from 'src/app/core/services/cart.service';
import { FormAddCart } from 'src/app/core/interfaces/cart';
import { SessionService } from 'src/app/core/services/session.service';
import { HttpStatusCode } from '@angular/common/http';
import {
  IonContent,
  AlertController,
  ToastController,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonImg,
  IonButton,
  IonIcon,
  IonRow,
  IonCol,
  IonGrid,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelectOption,
  IonSelect,
  IonTextarea
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.page.html',
  styleUrls: ['./detail-product.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonImg,
    IonButton,
    IonIcon,
    IonRow,
    IonCol,
    IonGrid,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    TitleCasePipe,
    DecimalPipe,
    HeaderComponent
  ]
})
export class DetailProductPage implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);

  public product = signal<Product>(productJson);
  private productSlug = this.activatedRoute.snapshot.params['slug'];
  public urlImage = signal<string>(environment.apiImages);
  public urlImageProduct = signal<string>('');
  public quantity = signal<number>(1);
  public averageRating = signal<number>(0);
  public relatedProducts = signal<Product[]>([]);

  reviews: any[] = [
    { user: 'Juan Pérez', rating: 5, comment: 'Excelente producto, muy recomendado.' },
    { user: 'María López', rating: 4, comment: 'Bueno, pero podría mejorar la calidad.' },
    { user: 'Carlos García', rating: 3, comment: 'Regular, no cumplió con todas mis expectativas.' },
  ];

  constructor() {
    addIcons({
      star,
      remove,
      add
    })
  }

  ngOnInit() {

    this.productService.getProductById(this.productSlug).subscribe(response => {

      this.product.set(response.data);
      this.urlImageProduct.set(this.urlImage() + this.getImageProduct(response.data.images));
      this.productService.getProuctsByCategory(response.data.category.idCategory).subscribe(response => {
        if(response.statusCode === HttpStatusCode.Ok){
          this.relatedProducts.set(response.data);
          return;
        };

        this.relatedProducts.set([]);
      })
    });


    this.calculateAverageRating();
  }

  public getImageProduct(images: Images[]): string {
    if(images.length !== 0){
      return images.filter((image) => image.type === 'cover')[0].urlImage
    }

    return "";
  }

  public addToCart() {

    if(!this.sessionService.validSession()){
      this.alertMessage('Para agregar productos al carrito, debes iniciar sesión.', 'Iniciar Sesión');
      return;
    }

    const addProductCart: FormAddCart = {
      idProduct: this.product().idProduct,
      quantity: this.quantity()
    }

    this.cartService.addProductCart(addProductCart).subscribe(() => {

      this.showToast('Producto agregado al carrito con exito.');
      this.router.navigate(['/cart']);
    })
  }

  private async alertMessage(message: string, title: string) {

    const alert = await this.alertController.create({
      header: title,
      message,
      buttons: ['Action'],
    });

    await alert.present();
  }


  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      icon: 'checkmark-circle',
      color: 'primary',
    });
    await toast.present();
  }

  increaseQuantity() {
    if (this.quantity() < this.product().stock) {
      this.quantity.update((value) => value + 1);
    }
  }

  decreaseQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update((value) => value - 1);
    }
  }

  viewProduct(productId: number) {
    console.log(`Navegando al producto relacionado con ID: ${productId}`);
  }

  calculateAverageRating() {
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating.set(this.reviews.length ? total / this.reviews.length : 0);
  }

  generateStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  get averageStars(): number[] {
    return Array(Math.round(this.averageRating())).fill(0);
  }

}
