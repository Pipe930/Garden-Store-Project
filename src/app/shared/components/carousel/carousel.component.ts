import { NgClass } from '@angular/common';
import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NgClass],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {

  public indicator = signal<boolean>(true);
  public controls = signal<boolean>(true);
  public autoSlide = input.required<boolean>();
  public slideInterval = signal<number>(3000);
  public selectedIndex = signal<number>(0);
  public images = [
    { src: '../../../../assets/imgs/Noticias-01-1.jpg' },
    { src: '../../../../assets/imgs/JARDINERIA_2_5.jpg' },
    { src: '../../../../assets/imgs/1140-green-thumb-esp.jpg' },
    { src: '../../../../assets/imgs/jardineria-ecologica_9994f7f8_230331125840_1280x720.jpg' }
  ];

  ngOnInit(): void {
    if(this.autoSlide()){
      this.autoSlideImage();
    }
  }

  public autoSlideImage():void{

    setInterval(() => {
      this.nextClick();
    }, this.slideInterval());
  }

  public selectedImage(index: number):void {
    this.selectedIndex.set(index);
  }

  public prevClick():void{

    if(this.selectedIndex() === 0){
      this.selectedIndex.set(this.images.length - 1);
    } else {

      this.selectedIndex.update(value => value - 1);
    }
  }

  public nextClick():void{

    if(this.selectedIndex() === this.images.length - 1){
      this.selectedIndex.set(0);
    } else {

      this.selectedIndex.update(value => value + 1);
    }
  }
}
