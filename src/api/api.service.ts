// api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/status`);
  }

  createFnol(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/fnol`, data);
  }

  updateFnol(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/fnol/${id}`, data);
  }
}