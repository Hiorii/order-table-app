import { Component } from '@angular/core';
import { SessionService } from '../../../shared/services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facts-container',
  templateUrl: './facts-container.component.html',
  styleUrl: './facts-container.component.scss'
})
export class FactsContainerComponent {
  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  logout() {
    this.sessionService.remove('currentUser');
    this.router.navigate(['/authentication/login']);
  }
}
