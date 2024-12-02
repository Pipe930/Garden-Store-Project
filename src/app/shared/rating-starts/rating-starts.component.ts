import { Component, input, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-rating-starts',
  standalone: true,
  imports: [],
  templateUrl: './rating-starts.component.html',
  styleUrl: './rating-starts.component.scss'
})
export class RatingStartsComponent implements OnInit {

  public rating = input.required<number>();
  public reviewsCount = input.required<number>();

  public filledStars = signal<number[]>([]);
  public emptyStars = signal<number[]>([]);
  public hasHalfStar = signal<boolean>(false);

  ngOnInit(): void {
    const fullStars = Math.floor(this.rating());

    console.log(fullStars)
    this.hasHalfStar.set(this.rating() % 1 !== 0);
    const totalStars = 5;

    this.filledStars.set(Array(fullStars).fill(0));
    this.emptyStars.set(Array(totalStars - fullStars - (this.hasHalfStar() ? 1 : 0)).fill(0));
  }
}
