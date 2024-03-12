import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;
  const store: { [key: string]: string } = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
    service = TestBed.inject(SessionService);

    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: jest.fn((key, value) => {
          store[key] = value;
        }),
        getItem: jest.fn((key) => {
          return store[key] || null;
        }),
        removeItem: jest.fn((key) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          Object.keys(store).forEach((key) => delete store[key]);
        })
      },
      writable: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set a value in localStorage', () => {
    service.set('testKey', 'testValue');
    expect(localStorage.setItem).toHaveBeenCalledWith('testKey', 'testValue');
  });

  it('should get a value from localStorage', () => {
    localStorage.setItem('testKey', 'testValue');
    const value = service.get('testKey');
    expect(value).toBe('testValue');
  });

  it('should remove a value from localStorage', () => {
    localStorage.setItem('testKey', 'testValue');
    service.remove('testKey');
    expect(localStorage.removeItem).toHaveBeenCalledWith('testKey');
  });

  it('should clear localStorage', () => {
    localStorage.setItem('testKey', 'testValue');
    service.clear();
    expect(localStorage.clear).toHaveBeenCalled();
  });
});
