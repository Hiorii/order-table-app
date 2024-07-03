import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  template: '<p-confirmDialog defaultFocus="none"></p-confirmDialog>',
  styleUrls: ['./confirm-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmModalComponent {}
