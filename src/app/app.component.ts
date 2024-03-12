import { Component, OnInit } from '@angular/core';
import { InitialService } from './shared/services/initial.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  title = 'cat-facts';

  constructor(private initialService: InitialService) {}

  ngOnInit(): void {
    this.initialService.handleMusic();
  }
}
