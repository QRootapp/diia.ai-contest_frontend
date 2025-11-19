import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
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
  caseId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stateService: ViolationStateService
  ) {}

  ngOnInit(): void {
    // Get caseId from route params
    this.route.paramMap.subscribe((params) => {
      this.caseId = params.get('caseId');
      if (this.caseId) {
        this.loadCaseById(this.caseId);
      } else {
        // Fallback to state service if no caseId in route
        this.stateService.caseStatus$.subscribe({
          next: (status) => {
            this.caseStatus = status;
          },
        });
      }
    });
  }

  loadCaseById(caseId: string): void {
    // Load case from localStorage
    const stored = localStorage.getItem('violations');
    if (stored) {
      const allCases = JSON.parse(stored);
      const foundCase = allCases.find((c: any) => c.caseId === caseId);
      if (foundCase) {
        this.caseStatus = {
          ...foundCase,
          submittedAt: new Date(foundCase.submittedAt),
          updates:
            foundCase.updates?.map((u: any) => ({
              ...u,
              timestamp: new Date(u.timestamp),
            })) || [],
        };
      }
    }
  }

  startNewReport(): void {
    // Reset state and start over
    this.stateService.reset();
    this.router.navigate(['/my-applications']);
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
