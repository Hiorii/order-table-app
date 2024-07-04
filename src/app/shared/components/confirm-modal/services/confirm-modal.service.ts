import { inject, Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {
  private confirmationService = inject(ConfirmationService);

  confirm(header: string, message: string, accept: () => void, reject?: () => void): void {
    this.confirmationService.confirm({
      header,
      message,
      accept,
      reject
    });
  }
}
