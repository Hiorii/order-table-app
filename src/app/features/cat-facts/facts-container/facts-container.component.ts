import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, filter, Observable, of, scan, startWith, Subject, switchMap, tap } from 'rxjs';
import { CatFactsService } from '../services/cat-facts.service';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from '../../authentication/services/authentication.service';

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
    public router: Router,
    private catFactService: CatFactsService,
    private authenticationService: AuthenticationService,
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
          return this.catFactService.fetchFacts('https://meowfacts.herokuapp.com', 5).pipe(
            catchError((error) => {
              console.error('Error fetching facts', error);
              return of(null);
            })
          );
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
    this.authenticationService.logout();
  }

  loadMoreFacts() {
    this.loadMoreTrigger.next();
  }

  navigateUp(): void {
    if (this.cardsContainer && this.cardsContainer.nativeElement) {
      this.cardsContainer.nativeElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}
