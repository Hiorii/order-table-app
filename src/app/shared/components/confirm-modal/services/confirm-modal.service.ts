import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {
  constructor(private confirmationService: ConfirmationService) {}

  confirm(header: string, message: string, accept: () => void, reject?: () => void): void {
    this.confirmationService.confirm({
      header,
      message,
      accept,
      reject
    });
  }
}
