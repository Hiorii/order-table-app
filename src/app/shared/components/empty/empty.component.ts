import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-empty',
  templateUrl: './empty.component.html'
})
export class EmptyComponent {
  @Input() icon: IconDefinition;
  @Input() title: string;
  @Input() details: string;
}