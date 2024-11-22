import { DatePipe, NgClass } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, input, OnChanges, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '@core/services/alert.service';
import { SessionService } from '@core/services/session.service';
import { CreateReview, Review } from '@pages/interfaces/review';
import { ReviewService } from '@pages/services/review.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, NgClass],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent implements OnInit, OnChanges {

  private readonly _reviewService = inject(ReviewService);
  private readonly _builder = inject(FormBuilder);
  private readonly _sessionService = inject(SessionService);
  private readonly _alertService = inject(AlertService);

  public idProduct = input.required<number>();
  public listReviews = signal<Review[]>([]);
  public averageRating = signal<number>(0);
  public totalReviews = signal<number>(0);
  public ratingIsValid = signal<boolean>(false);
  public stars = signal<number[]>([1, 2, 3, 4, 5]);
  public rating = signal<number>(0);

  progressBars: { stars: string; percentage: number; count: number }[] = [];
  public averageStars = signal<number[]>(Array(5).fill(null));

  public createReviewForm: FormGroup = this._builder.group({
    title: this._builder.control('', [Validators.required, Validators.maxLength(255)]),
    content: this._builder.control('', [Validators.required, Validators.maxLength(255)])
  })

  ngOnInit(): void {
    this._reviewService.getReviewsProduct(this.idProduct());
    this._reviewService.listReviews$.subscribe(reviews => {
      if(reviews.length !== 0){
        this.listReviews.set(reviews);
      } else {
        this.listReviews.set([]);
      }
      this.calculateStats();
    })
  }

  ngOnChanges(): void {
    this._reviewService.getReviewsProduct(this.idProduct());
  }

  public generateStars(rating: number): string[] {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (rating >= i + 1) {
        stars.push('bx bxs-star');
      } else {
        stars.push('bx bx-star');
      }
    }
    return stars;
  }

  public calculateStats() {
    this.totalReviews.set(this.listReviews().length);
    const starsCount = [0, 0, 0, 0, 0];

    this.listReviews().forEach((review) => {
      starsCount[review.rating - 1]++;
    });

    const totalStars = this.listReviews().reduce(
      (sum, review) => sum + review.rating,
      0
    );
    this.averageRating.set(totalStars / this.totalReviews());

    this.progressBars = starsCount.map((count, index) => ({
      stars: '★'.repeat(5 - index),
      percentage: (count / this.totalReviews()) * 100,
      count,
    }));
  }

  public setRating(newRating: number): void {
    this.rating.set(newRating);
  }

  public createReview(): void {

    if(!this._sessionService.validSession()){
      this._alertService.info('Tienes que Iniciar Sesion', "Para poder dejar una reseña, iniciá sesión");
      return;
    }

    if(this.createReviewForm.invalid) {
      this.createReviewForm.markAllAsTouched();
      return;
    }

    if(this.rating() === 0) {
      this.ratingIsValid.set(true);
      return;
    }

    const reviewJson: CreateReview = {
      idProduct: this.idProduct(),
      rating: this.rating(),
      title: this.createReviewForm.value.title,
      content: this.createReviewForm.value.content
    }

    this._reviewService.createReview(reviewJson).subscribe(response => {
      this._alertService.success('Reseña creada', 'Tu reseña ha sido creada con éxito');
      this._reviewService.getReviewsProduct(this.idProduct());
      this.createReviewForm.reset();
    });
  }

  get title() {
    return this.createReviewForm.controls["title"];
  }

  get content() {
    return this.createReviewForm.controls["content"];
  }
}
