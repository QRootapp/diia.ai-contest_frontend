import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CameraService, CapturedPhoto } from '../../services/camera.service';
import { GeolocationService } from '../../services/geolocation.service';
import { ViolationApiService } from '../../services/violation-api.service';
import { ViolationStateService } from '../../services/violation-state.service';
import {
  PhotoData,
  PlateRecognition,
  ViolationSession,
} from '../../models/violation.model';
import { TimerService } from '../../services/timer.service';

@Component({
  selector: 'app-slide5-second-photo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step2-second-photo.component.html',
  styleUrls: ['./step2-second-photo.component.scss'],
})
export class Slide5SecondPhotoComponent implements OnInit, OnDestroy {
  session: ViolationSession | null = null;
  capturedSecondPhoto: PhotoData | null = null;
  analysisError: string | null = null;
  analysisWarning: string | null = null;
  captureError: string | null = null;
  isCapturing = false;
  isProcessing = false;
  isPhotoAnalyzed = false;
  currentTime = new Date();
  gpsError: string | null = null;

  timeRemaining = 5;
  formattedTimer = '00:05';
  progress = 0;
  private timerInterval: any;

  constructor(
    private router: Router,
    private cameraService: CameraService,
    private geoService: GeolocationService,
    private apiService: ViolationApiService,
    private stateService: ViolationStateService,
    private timerService: TimerService
  ) {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnInit(): void {
    this.stateService.session$.subscribe({
      next: (session) => {
        this.session = session;
      },
    });
    if (!this.session?.firstPhoto) {
      this.router.navigate(['/capture-first-photo']);
      return;
    }
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer(): void {
    const totalTime = 5;
    this.timeRemaining = totalTime;
    this.formattedTimer = this.formatTimer(this.timeRemaining);

    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
        this.formattedTimer = this.formatTimer(this.timeRemaining);
        this.progress = ((totalTime - this.timeRemaining) / totalTime) * 100;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  formatTimer(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }

  takeSecondPhoto(): void {
    if (!this.session?.firstPhoto) {
      this.router.navigate(['/capture-first-photo']);
      return;
    }

    this.isCapturing = true;
    this.analysisError = null;
    this.analysisWarning = null;
    this.captureError = null;
    this.capturedSecondPhoto = null;
    this.gpsError = null;
    this.isPhotoAnalyzed = false;

    this.cameraService.capturePhoto().subscribe({
      next: (capture: CapturedPhoto) => {
        this.geoService.getCurrentPosition().subscribe({
          next: (location) => {
            const photoData: PhotoData = {
              previewUrl: capture.previewUrl,
              file: capture.file,
              timestamp: new Date(),
              geoLocation: location,
            };

            this.isCapturing = false;
            this.isProcessing = true;
            this.submitSecondPhoto(photoData);
          },
          error: (error) => {
            console.error('GPS error during photo capture:', error);
            this.isCapturing = false;
            this.gpsError =
              error.message || 'Не вдалося отримати координати GPS';
          },
        });
      },
      error: (error) => {
        console.error('Camera error:', error);
        this.isCapturing = false;
        this.captureError =
          typeof error === 'string' ? error : 'Помилка камери';
      },
    });
  }

  private validatePlate(plate: string): boolean {
    const regex = /^[A-Z]{2}\d{4}[A-Z]{2}$/;
    return regex.test(plate);
  }

  private submitSecondPhoto(photoData: PhotoData): void {
    if (!photoData.file) {
      this.analysisError = 'Файл другого фото відсутній. Спробуйте ще раз.';
      this.isProcessing = false;
      return;
    }

    this.apiService.checkPlate(photoData.file).subscribe({
      next: (analysis: PlateRecognition) => {
        if (!analysis.plate || analysis.confidence === null) {
          this.analysisError = 'Не вдалося розпізнати номерні знаки';
          this.capturedSecondPhoto = null;
          this.isProcessing = false;
          this.isPhotoAnalyzed = false;
          return;
        }

        if (!this.validatePlate(analysis.plate)) {
          this.analysisWarning =
            'Розпізнаний номер не відповідає формату українських номерів (XX0000XX). Будь ласка, переробіть фото.';
          this.analysisError = null;
          // Show result + warning
          photoData.analysis = analysis;
          this.capturedSecondPhoto = photoData;
          this.isProcessing = false;
          this.isPhotoAnalyzed = true; // Allows viewing result, but Continue is blocked
          return;
        }

        if (
          this.session?.firstPhoto?.analysis &&
          analysis.plate !== this.session.firstPhoto.analysis.plate
        ) {
          this.analysisError =
            'Номери не співпадають з першим фото. Переробіть фото будь ласка.';
          this.capturedSecondPhoto = null;
          this.isProcessing = false;
          this.isPhotoAnalyzed = false;
          return;
        }

        photoData.analysis = analysis;
        const durationSeconds = this.calculateDurationSeconds(photoData);
        this.stateService.addSecondPhoto(photoData, durationSeconds);

        this.capturedSecondPhoto = photoData;
        this.isProcessing = false;
        this.isPhotoAnalyzed = true;
        this.analysisError = null;
        this.analysisWarning = null;
      },
      error: (error) => {
        console.error('Error analyzing second photo:', error);
        this.analysisError =
          'Не вдалося проаналізувати друге фото. Спробуйте ще раз.';
        this.isProcessing = false;
        this.isPhotoAnalyzed = false;
        this.capturedSecondPhoto = null;
      },
    });
  }

  private calculateDurationSeconds(photoData: PhotoData): number {
    if (!this.session?.firstPhoto) return 0;
    const diff =
      photoData.timestamp.getTime() -
      this.session.firstPhoto.timestamp.getTime();
    return Math.max(0, Math.floor(diff / 1000));
  }

  restartProcess(): void {
    this.stateService.clearSession();
    this.router.navigate(['/capture-first-photo']);
  }

  proceedToReview(): void {
    this.router.navigate(['/review']);
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  calculateDuration(): string {
    if (this.session?.firstPhoto) {
      const endTime = this.capturedSecondPhoto
        ? this.capturedSecondPhoto.timestamp
        : this.currentTime;
      const diff =
        endTime.getTime() - this.session.firstPhoto.timestamp.getTime();
      const seconds = Math.floor(diff / 1000);
      return this.timerService.formatDuration(seconds);
    }
    return '5 хв 00 с';
  }
}
