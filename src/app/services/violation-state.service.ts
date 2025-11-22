import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ViolationSession,
  PhotoData,
  ApplicantInfo,
  Report,
} from '../models/violation.model';

@Injectable({
  providedIn: 'root',
})
export class ViolationStateService {
  private sessionSubject = new BehaviorSubject<ViolationSession | null>(null);
  public session$: Observable<ViolationSession | null> =
    this.sessionSubject.asObservable();

  constructor() {}

  startSession(firstPhoto: PhotoData): void {
    const session: ViolationSession = {
      draftId: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      firstPhoto,
      status: 'draft',
    };
    this.sessionSubject.next(session);
  }

  addSecondPhoto(secondPhoto: PhotoData, duration: number): void {
    const currentSession = this.sessionSubject.value;
    if (!currentSession) return;
    const updated: ViolationSession = {
      ...currentSession,
      secondPhoto,
      duration,
      status: 'ready',
    };
    this.sessionSubject.next(updated);
  }

  setApplicantInfo(applicant: ApplicantInfo): void {
    const currentSession = this.sessionSubject.value;
    if (!currentSession) return;
    const updated: ViolationSession = {
      ...currentSession,
      applicant,
    };
    this.sessionSubject.next(updated);
  }

  setBackendReport(report: Report): void {
    const currentSession = this.sessionSubject.value;
    if (!currentSession) return;

    const initialPhoto = report.photos.find(
      (photo) => photo.photo_type === 'initial'
    );
    const confirmationPhoto = report.photos.find(
      (photo) => photo.photo_type === 'confirmation'
    );

    const updated: ViolationSession = {
      ...currentSession,
      reportId: report.id,
      reportNumber: report.report_number,
      backendReport: report,
      status: 'submitted',
      firstPhoto: {
        ...currentSession.firstPhoto,
        photoUrl: initialPhoto?.photo_url ?? currentSession.firstPhoto.photoUrl,
      },
      secondPhoto: currentSession.secondPhoto
        ? {
            ...currentSession.secondPhoto,
            photoUrl:
              confirmationPhoto?.photo_url ??
              currentSession.secondPhoto.photoUrl,
          }
        : currentSession.secondPhoto,
    };

    this.sessionSubject.next(updated);
  }

  getSession(): ViolationSession | null {
    return this.sessionSubject.value;
  }

  reset(): void {
    this.sessionSubject.next(null);
  }
}
