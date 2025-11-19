import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Application {
  id: string;
  caseId: string;
  licensePlate: string;
  submittedAt: Date;
  status:
    | 'active'
    | 'under_review'
    | 'decision_pending'
    | 'resolution_issued'
    | 'fine_applied';
  firstPhotoUrl: string;
}

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss'],
})
export class MyApplicationsComponent implements OnInit {
  applications: Application[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Load applications from localStorage
    this.loadApplications();
  }

  loadApplications(): void {
    const stored = localStorage.getItem('violations');
    if (stored) {
      const allApplications = JSON.parse(stored);
      this.applications = allApplications.map((app: any) => ({
        ...app,
        submittedAt: new Date(app.submittedAt),
      }));
      // Sort by date descending (newest first)
      this.applications.sort(
        (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()
      );
    }
  }

  viewApplication(app: Application): void {
    this.router.navigate(['/status', app.caseId]);
  }

  startNewReport(): void {
    this.router.navigate(['/capture-first-photo']);
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

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      active: 'Активна',
      under_review: 'На розгляді',
      decision_pending: 'Очікує рішення',
      resolution_issued: 'Рішення прийнято',
      fine_applied: 'Штраф застосовано',
    };
    return labels[status] || 'Невідомо';
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      active: 'status-active',
      under_review: 'status-review',
      decision_pending: 'status-pending',
      resolution_issued: 'status-resolved',
      fine_applied: 'status-fined',
    };
    return classes[status] || 'status-active';
  }
}
