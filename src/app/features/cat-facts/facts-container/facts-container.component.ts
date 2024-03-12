import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { SessionService } from '../../../shared/services/session.service';
import { Router } from '@angular/router';
import { filter, Observable, of, scan, startWith, Subject, switchMap, tap } from 'rxjs';
import { CatFactsService } from '../services/cat-facts.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-facts-container',
  templateUrl: './facts-container.component.html',
  styleUrl: './facts-container.component.scss'
})
export class FactsContainerComponent implements OnInit {
  @ViewChild('cardsContainer') cardsContainer: ElementRef;

  @HostListener('document:mousewheel', ['$event'])
  onScroll() {
    if (this.cardsContainer.nativeElement) {
      const pos = this.cardsContainer.nativeElement.scrollTop + this.document.documentElement.offsetHeight;
      const max = this.cardsContainer.nativeElement.scrollHeight;
      if (pos >= max - 300 && !this.loadingMoreFacts) {
        this.loadMoreFacts();
      }
    }
  }

  private loadMoreTrigger = new Subject<void>();
  private loadingMoreFacts = false;
  public facts$: Observable<string[]>;

  constructor(
    private sessionService: SessionService,
    public router: Router,
    private catFactService: CatFactsService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.listenToFactsLoad();
    this.loadMoreFacts();
  }

  listenToFactsLoad() {
    this.facts$ = this.loadMoreTrigger.pipe(
      startWith(void 0),
      switchMap(() => {
        if (!this.loadingMoreFacts) {
          this.loadingMoreFacts = true;
          return this.catFactService.fetchFacts('https://meowfacts.herokuapp.com', 5);
        } else {
          return of(null);
        }
      }),
      filter((facts): facts is string[] => facts !== null),
      scan((accumulatedFacts: string[], newFacts) => {
        const updatedFacts = new Set([...accumulatedFacts, ...newFacts]);
        return Array.from(updatedFacts);
      }, []),
      tap(() => (this.loadingMoreFacts = false))
    );
  }

  logout() {
    this.sessionService.remove('currentUser');
    this.router.navigate(['/authentication/login']);
  }

  loadMoreFacts() {
    this.loadMoreTrigger.next();
  }
}
