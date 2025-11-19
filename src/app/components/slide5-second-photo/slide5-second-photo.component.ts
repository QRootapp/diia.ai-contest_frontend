import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CameraService } from '../../services/camera.service';
import { GeolocationService } from '../../services/geolocation.service';
import { ViolationApiService } from '../../services/violation-api.service';
import { ViolationStateService } from '../../services/violation-state.service';
import { PhotoData, ViolationSession } from '../../models/violation.model';
import { TimerService } from '../../services/timer.service';

@Component({
  selector: 'app-slide5-second-photo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide5-second-photo.component.html',
  styleUrls: ['./slide5-second-photo.component.scss'],
})
export class Slide5SecondPhotoComponent implements OnInit {
  session: ViolationSession | null = null;
  capturedSecondPhoto: PhotoData | null = null;
  isCapturing = false;
  isProcessing = false;
  currentTime = new Date();
  gpsError: string | null = null;

  constructor(
    private router: Router,
    private cameraService: CameraService,
    private geoService: GeolocationService,
    private apiService: ViolationApiService,
    private stateService: ViolationStateService,
    private timerService: TimerService
  ) {
    // Update current time every second
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
  }

  takeSecondPhoto(): void {
    if (!this.session) return;

    this.isCapturing = true;
    this.gpsError = null;
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
            this.capturedSecondPhoto = photoData;
            this.isCapturing = false;
            this.isProcessing = true;

            // Calculate duration and submit
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
      },
    });
  }

  private submitSecondPhoto(photoData: PhotoData): void {
    if (!this.session) return;

    const duration = Math.floor(
      (photoData.timestamp.getTime() -
        this.session.firstPhoto.timestamp.getTime()) /
        1000
    );

    this.apiService
      .submitSecondPhoto(this.session.sessionId, photoData)
      .subscribe({
        next: (response) => {
          // Update session with second photo
          this.stateService.addSecondPhoto(photoData, duration);

          // Auto-navigate to review
          this.router.navigate(['/review']);
        },
        error: (error) => {
          console.error('Error submitting second photo:', error);
          this.isProcessing = false;
        },
      });
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
