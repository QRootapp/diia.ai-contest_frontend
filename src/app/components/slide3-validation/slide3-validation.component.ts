import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViolationSession } from '../../models/violation.model';
import { GeolocationService } from '../../services/geolocation.service';
import { ViolationStateService } from '../../services/violation-state.service';

@Component({
  selector: 'app-slide3-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide3-validation.component.html',
  styleUrls: ['./slide3-validation.component.scss'],
})
export class Slide3ValidationComponent implements OnInit, OnDestroy {
  session: ViolationSession | null = null;
  gpsCoordinates = '';
  timeRemaining = 5; // 5 seconds
  formattedTime = '0:05';
  private timerInterval: any;

  constructor(
    private router: Router,
    private geoService: GeolocationService,
    private stateService: ViolationStateService
  ) {}

  ngOnInit(): void {
    // Get session from state
    this.stateService.session$.subscribe({
      next: (session) => {
        this.session = session;
        if (session?.firstPhoto.geoLocation) {
          this.gpsCoordinates = this.geoService.formatCoordinates(
            session.firstPhoto.geoLocation
          );
        }
      },
    });

    // Start countdown timer
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
        this.formattedTime = this.formatTimer(this.timeRemaining);
      }
    }, 1000);
  }

  formatTimer(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  takeSecondPhoto(): void {
    this.router.navigate(['/capture-second-photo']);
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('uk-UA');
  }
}
