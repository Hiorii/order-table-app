import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CatFactsService } from './cat-facts.service';

describe('CatFactsService', () => {
  let service: CatFactsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CatFactsService]
    });
    service = TestBed.inject(CatFactsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch facts and return them as received', () => {
    const mockUrl = 'https://meowfacts.herokuapp.com';
    const mockCount = 5;
    const mockResponse = { data: ['Fact 1', 'Fact 2', 'Fact 3'] };

    service.fetchFacts(mockUrl, mockCount).subscribe((facts) => {
      expect(facts.length).toBe(3);
      expect(facts).toEqual(mockResponse.data);
    });

    const req = httpMock.expectOne(`${mockUrl}/?count=${mockCount}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });
});
