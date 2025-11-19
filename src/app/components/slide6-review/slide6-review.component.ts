import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViolationSession } from '../../models/violation.model';
import { GeolocationService } from '../../services/geolocation.service';
import { ViolationStateService } from '../../services/violation-state.service';

@Component({
  selector: 'app-slide6-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide6-review.component.html',
  styleUrls: ['./slide6-review.component.scss'],
})
export class Slide6ReviewComponent implements OnInit {
  session: ViolationSession | null = null;

  constructor(
    private router: Router,
    private geoService: GeolocationService,
    private stateService: ViolationStateService
  ) {}

  ngOnInit(): void {
    this.stateService.session$.subscribe({
      next: (session) => {
        this.session = session;
      },
    });
  }

  proceedToSubmit(): void {
    this.router.navigate(['/submit']);
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  formatCoordinates(lat: number, lon: number): string {
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}
