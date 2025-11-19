import { Routes } from '@angular/router';
import { Slide1IntroComponent } from './components/slide1-intro/slide1-intro.component';
import { Slide2PhotoCaptureComponent } from './components/slide2-photo-capture/slide2-photo-capture.component';
import { Slide3ValidationComponent } from './components/slide3-validation/slide3-validation.component';
import { Slide4TimerComponent } from './components/slide4-timer/slide4-timer.component';
import { Slide5SecondPhotoComponent } from './components/slide5-second-photo/slide5-second-photo.component';
import { Slide6ReviewComponent } from './components/slide6-review/slide6-review.component';
import { Slide7SubmissionComponent } from './components/slide7-submission/slide7-submission.component';
import { Slide8IntegrationComponent } from './components/slide8-integration/slide8-integration.component';
import { Slide9StatusComponent } from './components/slide9-status/slide9-status.component';

export const routes: Routes = [
  { path: '', redirectTo: '/intro', pathMatch: 'full' },
  { path: 'intro', component: Slide1IntroComponent },
  { path: 'capture-first-photo', component: Slide2PhotoCaptureComponent },
  { path: 'validation', component: Slide3ValidationComponent },
  { path: 'timer', component: Slide4TimerComponent },
  { path: 'capture-second-photo', component: Slide5SecondPhotoComponent },
  { path: 'review', component: Slide6ReviewComponent },
  { path: 'submit', component: Slide7SubmissionComponent },
  { path: 'integration-info', component: Slide8IntegrationComponent },
  { path: 'status', component: Slide9StatusComponent },
  { path: '**', redirectTo: '/intro' },
];
