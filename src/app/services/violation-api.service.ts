import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  PlateRecognition,
  Report,
  ReportsListResponse,
} from '../models/violation.model';
import { environment } from '../../environments/environment';

interface CreateReportRequest {
  latitude: number;
  longitude: number;
  createdAt: Date;
  vehicleLicensePlate: string;
  firstName: string;
  lastName: string;
  middleName: string;
  confidence: number;
  file: File;
}

interface UpdateReportRequest {
  latitude: number;
  longitude: number;
  createdAt: Date;
  durationMinutes: number;
  vehicleLicensePlate: string;
  confidence: number;
  file: File;
}

interface ReportsListResponseRaw {
  data: any[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class ViolationApiService {
  private readonly baseUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  checkPlate(file: File): Observable<PlateRecognition> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<PlateRecognition>(
      `${this.baseUrl}/check-plate`,
      formData
    );
  }

  createReport(payload: CreateReportRequest): Observable<Report> {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('latitude', payload.latitude.toString());
    formData.append('longitude', payload.longitude.toString());
    formData.append('createdAt', payload.createdAt.toISOString());
    formData.append('vehicleLicensePlate', payload.vehicleLicensePlate);
    formData.append('firstName', payload.firstName);
    formData.append('lastName', payload.lastName);
    formData.append('middleName', payload.middleName);
    formData.append('confidence', payload.confidence.toString());

    return this.http
      .post<Report>(this.baseUrl, formData)
      .pipe(map((report) => this.normalizeReport(report)));
  }

  updateReport(
    reportId: number,
    payload: UpdateReportRequest
  ): Observable<Report> {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('latitude', payload.latitude.toString());
    formData.append('longitude', payload.longitude.toString());
    formData.append('createdAt', payload.createdAt.toISOString());
    formData.append('durationMinutes', payload.durationMinutes.toString());
    formData.append('vehicleLicensePlate', payload.vehicleLicensePlate);
    formData.append('confidence', payload.confidence.toString());

    return this.http
      .patch<Report>(`${this.baseUrl}/${reportId}`, formData)
      .pipe(map((report) => this.normalizeReport(report)));
  }

  getReports(page = 1, limit = 10): Observable<ReportsListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<ReportsListResponseRaw>(this.baseUrl, { params }).pipe(
      map((response) => ({
        ...response,
        data: response.data.map((report) => this.normalizeReport(report)),
      }))
    );
  }

  getReportById(id: number): Observable<Report> {
    return this.http
      .get<Report>(`${this.baseUrl}/${id}`)
      .pipe(map((report) => this.normalizeReport(report)));
  }

  private normalizeReport(report: any): Report {
    const photos =
      typeof report.photos === 'string'
        ? JSON.parse(report.photos || '[]')
        : report.photos || [];
    return {
      ...report,
      photos,
    };
  }
}
