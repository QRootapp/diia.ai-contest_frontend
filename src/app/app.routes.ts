import { Routes } from '@angular/router';
import { Slide1IntroComponent } from './components/step1-intro/step1-intro.component';
import { Slide2PhotoCaptureComponent } from './components/step2-first-photo/step2-first-photo.component';
import { Slide5SecondPhotoComponent } from './components/step3-second-photo/step3-second-photo.component';
import { Slide6ReviewComponent } from './components/step4-review/step4-review.component';
import { Slide7SubmissionComponent } from './components/step5-submission/step5-submission.component';
import { Slide9StatusComponent } from './components/step6-status/step6-status.component';
import { MyApplicationsComponent } from './components/my-applications/my-applications.component';
import { sessionGuard, statusGuard } from './guards/session.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/intro', pathMatch: 'full' },
  { path: 'intro', component: Slide1IntroComponent },
  { path: 'my-applications', component: MyApplicationsComponent },
  {
    path: 'capture-first-photo',
    component: Slide2PhotoCaptureComponent,
    canActivate: [sessionGuard],
  },
  {
    path: 'capture-second-photo',
    component: Slide5SecondPhotoComponent,
    canActivate: [sessionGuard],
  },
  {
    path: 'review',
    component: Slide6ReviewComponent,
    canActivate: [sessionGuard],
  },
  {
    path: 'submit',
    component: Slide7SubmissionComponent,
    canActivate: [sessionGuard],
  },
  {
    path: 'status/:caseId',
    component: Slide9StatusComponent,
    canActivate: [statusGuard],
  },
  { path: '**', redirectTo: '/intro' },
];
