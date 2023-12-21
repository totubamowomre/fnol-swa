import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should get status', () => {
    const mockResponse = { status: 'OK' };

    service.getStatus().subscribe((response: HttpResponse<any>) => {
      expect(response.body).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/api/status`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse, { status: 200, statusText: 'OK' });
  });

  it('should create FNOL', () => {
    const mockData = {
      /* your mock data here */
    };
    const mockResponse = {
      /* your mock response here */
    };

    service.createFnol(mockData).subscribe((response: HttpResponse<any>) => {
      expect(response.body).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/api/fnol`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);

    req.flush(mockResponse, { status: 201, statusText: 'Created' });
  });

  it('should update FNOL', () => {
    const mockId = '123';
    const mockData = { data: 'Data' };
    const mockResponse = { response: 'Reponse' };

    service
      .updateFnol(mockId, mockData)
      .subscribe((response: HttpResponse<any>) => {
        expect(response.body).toEqual(mockResponse);
      });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/api/fnol/${mockId}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockData);

    req.flush(mockResponse, { status: 200, statusText: 'OK' });
  });
});
