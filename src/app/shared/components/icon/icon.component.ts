import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition, IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent implements OnInit {
  @Input() name: IconProp | IconDefinition;
  @Input() fad = false;
  styles = Object.create(null);
  _iconStyles: { [key: string]: string };

  @Input() set iconStyles(iconStylesData: { [key: string]: string }) {
    this._iconStyles = iconStylesData;

    if (this._iconStyles) {
      this.styles = { ...this.styles, ...this._iconStyles };
    }
  }

  ngOnInit() {
    if (this._iconStyles) {
      this.styles = { ...this.styles, ...this._iconStyles };
    }
  }
}
