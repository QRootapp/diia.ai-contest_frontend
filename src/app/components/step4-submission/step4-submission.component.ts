import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicantInfo, ViolationSession } from '../../models/violation.model';
import { ViolationApiService } from '../../services/violation-api.service';
import { ViolationStateService } from '../../services/violation-state.service';

@Component({
  selector: 'app-slide7-submission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step4-submission.component.html',
  styleUrls: ['./step4-submission.component.scss'],
})
export class Slide7SubmissionComponent implements OnInit {
  session: ViolationSession | null = null;
  firstName = '';
  lastName = '';
  middleName = '';
  userPhone = '';
  vehiclePlate = '';

  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private apiService: ViolationApiService,
    private stateService: ViolationStateService
  ) {}

  ngOnInit(): void {
    this.stateService.session$.subscribe({
      next: (session) => {
        this.session = session;
        if (!session?.firstPhoto || !session.secondPhoto) {
          this.router.navigate(['/capture-first-photo']);
          return;
        }
        const detectedPlate =
          session.secondPhoto.analysis?.plate ||
          session.firstPhoto.analysis?.plate ||
          '';
        this.vehiclePlate = detectedPlate;
        if (session.applicant) {
          this.patchApplicant(session.applicant);
        }
      },
    });
  }

  onSubmit(): void {
    if (
      !this.session ||
      !this.session.firstPhoto ||
      !this.session.secondPhoto
    ) {
      this.errorMessage = 'Зробіть обидва фото перед подачею заяви.';
      return;
    }

    if (!this.firstName || !this.lastName || !this.middleName) {
      this.errorMessage = 'Заповніть ПІБ заявника.';
      return;
    }

    if (!this.vehiclePlate) {
      this.errorMessage = 'Вкажіть номерний знак транспортного засобу.';
      return;
    }

    if (!this.session.firstPhoto.file || !this.session.secondPhoto.file) {
      this.errorMessage =
        'Вихідні файли фото відсутні. Будь ласка, зробіть фото повторно.';
      return;
    }

    this.errorMessage = null;
    const applicant: ApplicantInfo = {
      firstName: this.firstName,
      lastName: this.lastName,
      middleName: this.middleName,
      phone: this.userPhone,
    };
    this.stateService.setApplicantInfo(applicant);

    const createPayload = {
      latitude: this.session.firstPhoto.geoLocation.latitude,
      longitude: this.session.firstPhoto.geoLocation.longitude,
      createdAt: this.session.firstPhoto.timestamp,
      vehicleLicensePlate: this.vehiclePlate.trim().toUpperCase(),
      firstName: this.firstName,
      lastName: this.lastName,
      middleName: this.middleName,
      confidence: this.session.firstPhoto.analysis?.confidence || 0,
      file: this.session.firstPhoto.file!,
    };

    this.isSubmitting = true;

    this.apiService.createReport(createPayload).subscribe({
      next: (report) => {
        this.submitConfirmationPhoto(report.id);
      },
      error: (error) => {
        console.error('Error creating report:', error);
        this.errorMessage =
          'Не вдалося створити заяву. Перевірте дані та спробуйте ще раз.';
        this.isSubmitting = false;
      },
    });
  }

  private submitConfirmationPhoto(reportId: number): void {
    if (!this.session?.secondPhoto || !this.session.secondPhoto.file) {
      this.errorMessage =
        'Не вдалося знайти друге фото. Будь ласка, повторіть крок.';
      this.isSubmitting = false;
      return;
    }

    const updatePayload = {
      latitude: this.session.secondPhoto.geoLocation.latitude,
      longitude: this.session.secondPhoto.geoLocation.longitude,
      createdAt: this.session.secondPhoto.timestamp,
      durationMinutes: this.calculateDurationMinutes(),
      vehicleLicensePlate:
        this.session.secondPhoto.analysis?.plate ||
        this.session.firstPhoto.analysis?.plate ||
        this.vehiclePlate.trim().toUpperCase(),
      confidence:
        this.session.secondPhoto.analysis?.confidence ||
        this.session.firstPhoto.analysis?.confidence ||
        0,
      file: this.session.secondPhoto.file!,
    };

    this.apiService.updateReport(reportId, updatePayload).subscribe({
      next: (updatedReport) => {
        this.stateService.setBackendReport(updatedReport);
        this.isSubmitting = false;
        this.router.navigate(['/status', updatedReport.id]);
      },
      error: (error) => {
        console.error('Error updating report:', error);
        this.errorMessage =
          'Не вдалося додати друге фото. Спробуйте ще раз або перестворіть заяву.';
        this.isSubmitting = false;
      },
    });
  }

  private patchApplicant(applicant: ApplicantInfo): void {
    this.firstName = applicant.firstName;
    this.lastName = applicant.lastName;
    this.middleName = applicant.middleName;
    this.userPhone = applicant.phone;
  }

  private calculateDurationMinutes(): number {
    const seconds = this.session?.duration || 0;
    return Math.max(1, Math.ceil(seconds / 60));
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
    return `${mins} хвилин`;
  }

  formatCoordinates(lat: number, lon: number): string {
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }

  formatConfidence(value?: number): string {
    return value ? `${(value * 100).toFixed(0)}%` : '---';
  }
}
