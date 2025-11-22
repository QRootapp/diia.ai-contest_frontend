import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Report } from '../../models/violation.model';
import { ViolationStateService } from '../../services/violation-state.service';
import { ViolationApiService } from '../../services/violation-api.service';

@Component({
  selector: 'app-slide9-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide9-status.component.html',
  styleUrls: ['./slide9-status.component.scss'],
})
export class Slide9StatusComponent implements OnInit {
  report: Report | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stateService: ViolationStateService,
    private apiService: ViolationApiService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('caseId');
      if (idParam) {
        const reportId = Number(idParam);
        if (isNaN(reportId)) {
          this.errorMessage = 'Некоректний ідентифікатор звернення.';
          return;
        }
        this.fetchReport(reportId);
      } else {
        const sessionReport = this.stateService.getSession()?.backendReport;
        if (sessionReport) {
          this.report = sessionReport;
        } else {
          this.router.navigate(['/my-applications']);
        }
      }
    });
  }

  fetchReport(reportId: number): void {
    this.isLoading = true;
    this.apiService.getReportById(reportId).subscribe({
      next: (report) => {
        this.report = report;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load report status', error);
        this.errorMessage = 'Не вдалося завантажити статус звернення.';
        this.isLoading = false;
      },
    });
  }

  startNewReport(): void {
    this.stateService.reset();
    this.router.navigate(['/my-applications']);
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

  getPhotoUrl(photoType: 'initial' | 'confirmation'): string | null {
    if (!this.report) return null;
    const photo = this.report.photos.find((p) => p.photo_type === photoType);
    return photo?.photo_url || null;
  }
}
