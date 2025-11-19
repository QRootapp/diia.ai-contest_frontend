import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, takeWhile, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timerSubject = new BehaviorSubject<number>(0);
  private targetSeconds = 300; // 5 minutes
  private isRunning = false;

  constructor() {}

  startTimer(durationSeconds: number = 300): Observable<number> {
    this.targetSeconds = durationSeconds;
    this.isRunning = true;

    return interval(1000).pipe(
      takeWhile(() => this.isRunning),
      map((elapsed) => {
        const remaining = this.targetSeconds - elapsed;
        this.timerSubject.next(remaining);

        if (remaining <= 0) {
          this.isRunning = false;
        }

        return remaining;
      })
    );
  }

  stopTimer(): void {
    this.isRunning = false;
  }

  formatTime(seconds: number): string {
    if (seconds < 0) seconds = 0;

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins} хв ${secs.toString().padStart(2, '0')} с`;
  }
}
