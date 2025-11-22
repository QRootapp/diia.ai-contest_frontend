import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViolationStateService } from '../../services/violation-state.service';

@Component({
  selector: 'app-slide1-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step1-intro.component.html',
  styleUrls: ['./step1-intro.component.scss'],
})
export class Slide1IntroComponent {
  title = 'Захист прав людей з інвалідністю';
  subtitle = 'Мобільний додаток для фіксації порушень паркування';

  constructor(
    private router: Router,
    private stateService: ViolationStateService
  ) {}

  startReport(): void {
    // Reset any existing session when starting a new report
    this.stateService.reset();
    this.router.navigate(['/capture-first-photo']);
  }

  viewMyApplications(): void {
    this.router.navigate(['/my-applications']);
  }
}
