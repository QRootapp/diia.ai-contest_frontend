import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CameraService } from '../../services/camera.service';
import { GeolocationService } from '../../services/geolocation.service';
import { ViolationApiService } from '../../services/violation-api.service';
import { ViolationStateService } from '../../services/violation-state.service';
import { PhotoData } from '../../models/violation.model';

@Component({
  selector: 'app-slide2-photo-capture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide2-photo-capture.component.html',
  styleUrls: ['./slide2-photo-capture.component.scss'],
})
export class Slide2PhotoCaptureComponent {
  isGpsActive = false;
  cameraActive = false;
  isProcessing = false;
  currentTime = new Date();
  capturedPhoto: PhotoData | null = null;
  isPhotoSubmitted = false;
  gpsError: string | null = null;

  constructor(
    private router: Router,
    private cameraService: CameraService,
    private geoService: GeolocationService,
    private apiService: ViolationApiService,
    private stateService: ViolationStateService
  ) {
    // Update time every second
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

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
    // Reset previous photo if retaking
    if (this.isPhotoSubmitted) {
      this.capturedPhoto = null;
      this.isPhotoSubmitted = false;
    }

    this.cameraActive = true;
    this.cameraService.capturePhoto().subscribe({
      next: (imageData) => {
        this.geoService.getCurrentPosition().subscribe({
          next: (location) => {
            const photoData: PhotoData = {
              imageData,
              timestamp: new Date(),
              geoLocation: location,
              fileName: `photo_violation_${Date.now()}.jpg`,
            };
            this.cameraActive = false;
            this.isProcessing = true;
            this.gpsError = null;

            // Submit to API and navigate automatically
            this.submitPhoto(photoData);
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
      },
    });
  }

  private submitPhoto(photoData: PhotoData): void {
    this.capturedPhoto = photoData;

    this.apiService.submitFirstPhoto(photoData).subscribe({
      next: (response) => {
        // Create session with validated data
        this.stateService.createSession(
          photoData,
          response.sessionId,
          response.licensePlate,
          'вул. Хрещатик, 1'
        );

        this.isProcessing = false;
        this.isPhotoSubmitted = true;
      },
      error: (error) => {
        console.error('Error submitting first photo:', error);
        this.isProcessing = false;
      },
    });
  }

  proceedToValidation(): void {
    this.router.navigate(['/validation']);
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
