import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ViolationSession, SubmissionData } from '../../models/violation.model';
import { ViolationApiService } from '../../services/violation-api.service';
import { ViolationStateService } from '../../services/violation-state.service';

@Component({
  selector: 'app-slide7-submission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './slide7-submission.component.html',
  styleUrls: ['./slide7-submission.component.scss'],
})
export class Slide7SubmissionComponent implements OnInit {
  session: ViolationSession | null = null;
  userFullName = 'Іваненко Петро Михайлович';
  userPhone = '+380 67 123 45 67';

  isSubmitting = false;
  isReadyToSubmit = true;

  constructor(
    private router: Router,
    private apiService: ViolationApiService,
    private stateService: ViolationStateService
  ) {}

  ngOnInit(): void {
    this.stateService.session$.subscribe({
      next: (session) => {
        this.session = session;
      },
    });
  }

  onSubmit(): void {
    if (!this.session || !this.isReadyToSubmit) return;

    const submissionData: SubmissionData = {
      sessionId: this.session.sessionId,
      userFullName: this.userFullName,
      userPhone: this.userPhone,
      licensePlate: this.session.licensePlate || '',
      address: this.session.address || 'вул. Хрещатик, 1',
      violationDate: this.session.firstPhoto.timestamp,
      startTime: this.formatTime(this.session.firstPhoto.timestamp),
      endTime: this.session.secondPhoto
        ? this.formatTime(this.session.secondPhoto.timestamp)
        : '',
      duration: this.session.duration || 300,
      photos: [
        this.session.firstPhoto,
        ...(this.session.secondPhoto ? [this.session.secondPhoto] : []),
      ],
      gpsMetadata: this.session.firstPhoto.geoLocation,
    };

    this.isSubmitting = true;

    this.apiService.submitViolation(submissionData).subscribe({
      next: (caseStatus) => {
        this.stateService.setCaseStatus(caseStatus);
        this.stateService.updateSessionStatus('submitted');

        // Auto-navigate to status page
        this.router.navigate(['/status']);
      },
      error: (error) => {
        console.error('Error submitting violation:', error);
        this.isSubmitting = false;
      },
    });
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('uk-UA');
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} хвилин`;
  }
}
