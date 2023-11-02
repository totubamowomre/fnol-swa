// api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStatus(): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.apiUrl}/api/status`, {
      observe: 'response',
    });
  }

  createFnol(data: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.apiUrl}/api/fnol`, data, {
      observe: 'response',
    });
  }

  updateFnol(id: string, data: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.apiUrl}/api/fnol/${id}`, data, {
      observe: 'response',
    });
  }
}
