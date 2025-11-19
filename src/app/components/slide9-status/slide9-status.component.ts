import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CaseStatus } from '../../models/violation.model';
import { ViolationStateService } from '../../services/violation-state.service';

@Component({
  selector: 'app-slide9-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide9-status.component.html',
  styleUrls: ['./slide9-status.component.scss'],
})
export class Slide9StatusComponent implements OnInit {
  caseStatus: CaseStatus | null = null;

  constructor(
    private router: Router,
    private stateService: ViolationStateService
  ) {}

  ngOnInit(): void {
    this.stateService.caseStatus$.subscribe({
      next: (status) => {
        this.caseStatus = status;
      },
    });
  }

  startNewReport(): void {
    // Reset state and start over
    this.stateService.reset();
    this.router.navigate(['/intro']);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatDateTime(date: Date): string {
    return `${this.formatDate(date)} ${this.formatTime(date)}`;
  }
}
