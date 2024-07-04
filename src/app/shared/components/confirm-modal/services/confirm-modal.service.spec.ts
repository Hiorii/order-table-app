import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { ConfirmModalService } from './confirm-modal.service';

jest.mock('primeng/api');

describe('ConfirmModalService', () => {
  let service: ConfirmModalService;
  let confirmationService: jest.Mocked<ConfirmationService>;

  beforeEach(() => {
    confirmationService = new ConfirmationService() as jest.Mocked<ConfirmationService>;

    TestBed.configureTestingModule({
      providers: [ConfirmModalService, { provide: ConfirmationService, useValue: confirmationService }]
    });

    service = TestBed.inject(ConfirmModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call confirm with the correct parameters', () => {
    const header = 'Test Header';
    const message = 'Test Message';
    const accept = jest.fn();
    const reject = jest.fn();

    service.confirm(header, message, accept, reject);

    expect(confirmationService.confirm).toHaveBeenCalledWith({
      header,
      message,
      accept,
      reject
    });
  });

  it('should call confirm with only accept when reject is not provided', () => {
    const header = 'Test Header';
    const message = 'Test Message';
    const accept = jest.fn();

    service.confirm(header, message, accept);

    expect(confirmationService.confirm).toHaveBeenCalledWith({
      header,
      message,
      accept,
      reject: undefined
    });
  });
});
