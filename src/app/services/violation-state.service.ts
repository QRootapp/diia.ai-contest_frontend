import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ViolationSession,
  PhotoData,
  CaseStatus,
} from '../models/violation.model';

@Injectable({
  providedIn: 'root',
})
export class ViolationStateService {
  private sessionSubject = new BehaviorSubject<ViolationSession | null>(null);
  public session$: Observable<ViolationSession | null> =
    this.sessionSubject.asObservable();

  private caseStatusSubject = new BehaviorSubject<CaseStatus | null>(null);
  public caseStatus$: Observable<CaseStatus | null> =
    this.caseStatusSubject.asObservable();

  constructor() {}

  createSession(
    firstPhoto: PhotoData,
    sessionId: string,
    licensePlate: string,
    address: string
  ): void {
    const session: ViolationSession = {
      sessionId,
      firstPhoto,
      licensePlate,
      address,
      status: 'pending',
    };
    this.sessionSubject.next(session);
  }

  addSecondPhoto(secondPhoto: PhotoData, duration: number): void {
    const currentSession = this.sessionSubject.value;
    if (currentSession) {
      currentSession.secondPhoto = secondPhoto;
      currentSession.duration = duration;
      currentSession.status = 'validated';
      this.sessionSubject.next(currentSession);
    }
  }

  updateSessionStatus(
    status: 'pending' | 'validated' | 'submitted' | 'active'
  ): void {
    const currentSession = this.sessionSubject.value;
    if (currentSession) {
      currentSession.status = status;
      this.sessionSubject.next(currentSession);
    }
  }

  setCaseStatus(status: CaseStatus): void {
    this.caseStatusSubject.next(status);
  }

  getSession(): ViolationSession | null {
    return this.sessionSubject.value;
  }

  getCaseStatus(): CaseStatus | null {
    return this.caseStatusSubject.value;
  }

  reset(): void {
    this.sessionSubject.next(null);
    this.caseStatusSubject.next(null);
  }
}
