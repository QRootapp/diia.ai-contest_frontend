import { Routes } from '@angular/router';
import { Slide1IntroComponent } from './components/intro/intro.component';
import { Slide2PhotoCaptureComponent } from './components/step1-first-photo/step1-first-photo.component';
import { Slide5SecondPhotoComponent } from './components/step2-second-photo/step2-second-photo.component';
import { Slide6ReviewComponent } from './components/step3-review/step3-review.component';
import { Slide7SubmissionComponent } from './components/step4-submission/step4-submission.component';
import { Slide9StatusComponent } from './components/step5-status/step5-status.component';

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
