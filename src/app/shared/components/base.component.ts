import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'no-op',
  template: ''
})
export class BaseComponent implements OnDestroy {
  protected destroyed$ = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
