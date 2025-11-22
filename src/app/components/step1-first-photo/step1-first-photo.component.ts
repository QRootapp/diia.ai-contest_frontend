import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CameraService, CapturedPhoto } from '../../services/camera.service';
import { GeolocationService } from '../../services/geolocation.service';
import { ViolationApiService } from '../../services/violation-api.service';
import { ViolationStateService } from '../../services/violation-state.service';
import { PhotoData, PlateRecognition } from '../../models/violation.model';

@Component({
  selector: 'app-slide2-photo-capture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step1-first-photo.component.html',
  styleUrls: ['./step1-first-photo.component.scss'],
})
export class Slide2PhotoCaptureComponent {
  isGpsActive = false;
  cameraActive = false;
  isProcessing = false;
  capturedPhoto: PhotoData | null = null;
  isPhotoAnalyzed = false;
  gpsError: string | null = null;
  analysisError: string | null = null;
  captureError: string | null = null;

  constructor(
    private router: Router,
    private cameraService: CameraService,
    private geoService: GeolocationService,
    private apiService: ViolationApiService,
    private stateService: ViolationStateService
  ) {
    // Get GPS status
    this.checkGPS();
  }

  checkGPS(): void {
    this.geoService.getCurrentPosition().subscribe({
      next: () => {
        this.isGpsActive = true;
        this.gpsError = null;
      },
      error: (error) => {
        this.isGpsActive = false;
        this.gpsError = error.message || 'Не вдалося отримати координати GPS';
      },
    });
  }

  openCamera(): void {
    this.resetPhotoState();
    this.cameraActive = true;
    this.cameraService.capturePhoto().subscribe({
      next: (capture: CapturedPhoto) => {
        this.geoService.getCurrentPosition().subscribe({
          next: (location) => {
            this.cameraActive = false;
            this.isProcessing = true;
            this.gpsError = null;

            const photoData: PhotoData = {
              previewUrl: capture.previewUrl,
              file: capture.file,
              timestamp: new Date(),
              geoLocation: location,
            };

            this.capturedPhoto = photoData;
            this.submitForAnalysis(photoData);
          },
          error: (error) => {
            console.error('GPS error during photo capture:', error);
            this.cameraActive = false;
            this.gpsError =
              error.message || 'Не вдалося отримати координати GPS';
            this.isGpsActive = false;
          },
        });
      },
      error: (error) => {
        console.error('Camera error:', error);
        this.cameraActive = false;
        this.captureError =
          typeof error === 'string' ? error : 'Помилка камери';
      },
    });
  }

  private submitForAnalysis(photoData: PhotoData): void {
    if (!photoData.file) {
      this.analysisError = 'Файл фото відсутній. Спробуйте ще раз.';
      this.isProcessing = false;
      return;
    }

    this.apiService.checkPlate(photoData.file).subscribe({
      next: (analysis: PlateRecognition) => {
        if (!analysis.plate || analysis.confidence === null) {
          this.analysisError = 'Не вдалося розпізнати номерні знаки';
          this.capturedPhoto = null;
          this.isProcessing = false;
          this.isPhotoAnalyzed = false;
          return;
        }

        photoData.analysis = analysis;
        this.stateService.startSession(photoData);
        this.isProcessing = false;
        this.isPhotoAnalyzed = true;
        this.analysisError = null;
      },
      error: (error) => {
        console.error('Error analyzing first photo:', error);
        this.analysisError =
          'Не вдалося розпізнати номер. Спробуйте зробити фото ще раз.';
        this.capturedPhoto = null;
        this.isProcessing = false;
        this.isPhotoAnalyzed = false;
      },
    });
  }

  private resetPhotoState(): void {
    this.capturedPhoto = null;
    this.isPhotoAnalyzed = false;
    this.analysisError = null;
    this.captureError = null;
  }

  proceedToNextStep(): void {
    this.router.navigate(['/capture-second-photo']);
  }

  goBack(): void {
    this.router.navigate(['/intro']);
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('uk-UA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
