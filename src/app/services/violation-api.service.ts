import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  PhotoData,
  AIValidationResponse,
  ViolationSession,
  SubmissionData,
  CaseStatus,
  StatusUpdate,
} from '../models/violation.model';

@Injectable({
  providedIn: 'root',
})
export class ViolationApiService {
  private mockSessionId = '';

  constructor() {}

  // Submit first photo and create session
  submitFirstPhoto(photoData: PhotoData): Observable<AIValidationResponse> {
    this.mockSessionId = this.generateSessionId();

    // Mock AI response
    const mockResponse: AIValidationResponse = {
      sessionId: this.mockSessionId,
      licensePlate: 'AA 1234 BB',
      isValidViolation: true,
      confidence: 0.95,
      violationType: 'Порушення паркування для осіб з інвалідністю',
      message: 'Номерний знак AA 1234 BB розпізнано успішно',
    };

    // Simulate API delay
    return of(mockResponse).pipe(delay(2000));
  }

  // Submit second photo (PATCH)
  submitSecondPhoto(
    sessionId: string,
    photoData: PhotoData
  ): Observable<AIValidationResponse> {
    const mockResponse: AIValidationResponse = {
      sessionId: sessionId,
      licensePlate: 'AA 1234 BB',
      isValidViolation: true,
      confidence: 0.97,
      violationType: 'Порушення паркування для осіб з інвалідністю',
      message: 'Друге фото підтверджує порушення',
    };

    return of(mockResponse).pipe(delay(1500));
  }

  // Submit complete violation report
  submitViolation(data: SubmissionData): Observable<CaseStatus> {
    const caseId = `2024-11-17-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')}`;

    const mockStatus: CaseStatus = {
      caseId: caseId,
      licensePlate: data.licensePlate,
      submittedAt: new Date(),
      status: 'active',
      updates: [
        {
          status: 'Прийнято до розгляду',
          timestamp: new Date(),
          description:
            'Звернення зареєстровано в системі МВС та передано до відповідного підрозділу',
          completed: true,
        },
        {
          status: 'На розгляді',
          timestamp: new Date(Date.now() + 120000),
          description: 'Інспектор Іванов О.П. розглядає матеріали справи',
          completed: true,
        },
        {
          status: 'Винесення постанови',
          timestamp: new Date(),
          description:
            'Очікується. Після перевірки доказів буде винесено рішення',
          completed: false,
        },
        {
          status: 'Постанова винесена',
          timestamp: new Date(),
          description: 'Очікується',
          completed: false,
        },
        {
          status: 'Накладено штраф',
          timestamp: new Date(),
          description: 'Очікується',
          completed: false,
        },
      ],
    };

    return of(mockStatus).pipe(delay(2500));
  }

  // Get case status
  getCaseStatus(caseId: string): Observable<CaseStatus> {
    // Mock status retrieval
    const mockStatus: CaseStatus = {
      caseId: caseId,
      licensePlate: 'AA 1234 BB',
      submittedAt: new Date('2024-11-17T14:38:22'),
      status: 'under_review',
      updates: [
        {
          status: 'Прийнято до розгляду',
          timestamp: new Date('2024-11-17T14:40:15'),
          description:
            'Звернення зареєстровано в системі МВС та передано до відповідного підрозділу',
          completed: true,
        },
        {
          status: 'На розгляді',
          timestamp: new Date('2024-11-17T15:20:30'),
          description: 'Інспектор Іванов О.П. розглядає матеріали справи',
          completed: true,
        },
        {
          status: 'Винесення постанови',
          timestamp: new Date(),
          description:
            'Очікується. Після перевірки доказів буде винесено рішення',
          completed: false,
        },
      ],
    };

    return of(mockStatus).pipe(delay(1000));
  }

  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `SESSION-${timestamp}-${random}`;
  }
}
