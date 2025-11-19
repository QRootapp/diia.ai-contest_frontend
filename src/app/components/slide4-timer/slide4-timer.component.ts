import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TimerService } from '../../services/timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-slide4-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide4-timer.component.html',
  styleUrls: ['./slide4-timer.component.scss'],
})
export class Slide4TimerComponent implements OnInit, OnDestroy {
  timeRemaining = 300; // 5 minutes
  formattedTime = '05:00';
  progress = 100;
  isGpsActive = true;
  photoCount = '1 з 2';
  private timerSubscription?: Subscription;

  constructor(private router: Router, private timerService: TimerService) {}

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.timerService.stopTimer();
  }

  startTimer(): void {
    this.timerSubscription = this.timerService.startTimer(300).subscribe({
      next: (remaining) => {
        this.timeRemaining = remaining;
        this.formattedTime = this.timerService.formatTime(remaining);
        this.progress = (remaining / 300) * 100;

        if (remaining <= 0) {
          // Auto-navigate to second photo capture
          this.router.navigate(['/capture-second-photo']);
        }
      },
    });
  }
}
