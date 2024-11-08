import { DatePipe, NgOptimizedImage, ViewportScroller } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionService } from '@core/services/session.service';
import { environment } from '@env/environment.development';
import { Post, Tag } from '@pages/interfaces/post';
import { PostService } from '@pages/services/post.service';

@Component({
  selector: 'app-list-posts',
  standalone: true,
  imports: [RouterLink, DatePipe, NgOptimizedImage],
  templateUrl: './list-posts.component.html',
  styleUrl: './list-posts.component.scss'
})
export class ListPostsComponent implements OnInit {

  private readonly _sessionService = inject(SessionService);
  private readonly _postService = inject(PostService);
  private readonly _viewportScroller = inject(ViewportScroller);

  public searchElement = viewChild.required<ElementRef>('searchElement');

  public isLoading = signal<boolean>(false);
  public cardsPlaceholder = signal<string[]>(new Array(4).fill(''));
  public currentPage = signal<number>(1);
  public totalPages = signal<number>(3);
  public urlImages = signal<string>(environment.apiImages);
  public validSession = signal<boolean>(false);
  public listTags = signal<Tag[]>([]);
  public listPosts = signal<Post[]>([]);

  ngOnInit(): void {
    this.validSession.set(this._sessionService.validSession());

    this._postService.getAllTags().subscribe((response) => {
      this.listTags.set(response.data);
    });

    this._postService.getAllPosts();
    this._postService.listPosts$.subscribe((response) => {
      this.listPosts.set(response);
      this.isLoading.set(true);
      this._postService.currentPage.asObservable().subscribe((page) => {
        this.currentPage.set(page);
      });
      this._postService.totalPages.asObservable().subscribe((totalPages) => {
        this.totalPages.set(totalPages);
      });
    });

  }

  public searchPosts(): void {

    let element = this.searchElement().nativeElement as HTMLInputElement;
    this._postService.searchPost(element.value);
  }

  public selectTag(idTag: number): void {

    this._postService.filterPost(idTag);
  }

  public changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this._postService.getPostsPage(page);
      this._viewportScroller.scrollToPosition([0, 0]);
    }
  }

  get pagesToShow(): number[] {

    const pages = [];
    const startPage = Math.max(this.currentPage() - 1, 1);
    const endPage = Math.min(this.currentPage() + 1, this.totalPages());

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    return pages;
  }

}
