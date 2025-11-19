import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slide1-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide1-intro.component.html',
  styleUrls: ['./slide1-intro.component.scss'],
})
export class Slide1IntroComponent {
  title = 'Захист прав людей з інвалідністю';
  subtitle = 'Мобільний додаток для фіксації порушень паркування';

  constructor(private router: Router) {}

  startReport(): void {
    this.router.navigate(['/capture-first-photo']);
  }

  viewMyApplications(): void {
    this.router.navigate(['/my-applications']);
  }
}
