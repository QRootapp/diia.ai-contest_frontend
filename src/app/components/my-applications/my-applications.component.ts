import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViolationApiService } from '../../services/violation-api.service';
import { Report } from '../../models/violation.model';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss'],
})
export class MyApplicationsComponent implements OnInit {
  applications: Report[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private apiService: ViolationApiService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    console.log(
      '[MyApplications] Loading reports from backend:',
      this.apiService['baseUrl'] || 'GET /reports'
    );
    this.apiService.getReports(1, 20).subscribe({
      next: (response) => {
        console.log('[MyApplications] Reports loaded:', response);
        this.applications = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load reports', error);
        this.errorMessage =
          'Не вдалося завантажити ваші звернення. Спробуйте пізніше.';
        this.isLoading = false;
      },
    });
  }

  viewApplication(app: Report): void {
    this.router.navigate(['/status', app.id]);
  }

  goBack(): void {
    this.router.navigate(['/intro']);
  }

  startNewReport(): void {
    this.router.navigate(['/capture-first-photo']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      draft: 'Чернетка',
      submitted: 'Надіслано',
      under_review: 'На розгляді',
      resolved: 'Вирішено',
      rejected: 'Відхилено',
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      draft: 'status-active',
      submitted: 'status-review',
      under_review: 'status-review',
      resolved: 'status-resolved',
      rejected: 'status-fined',
    };
    return classes[status] || 'status-active';
  }
}
