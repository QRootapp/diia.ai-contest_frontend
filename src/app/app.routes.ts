import { Routes } from '@angular/router';
import { Slide1IntroComponent } from './components/slide1-intro/slide1-intro.component';
import { Slide2PhotoCaptureComponent } from './components/slide2-photo-capture/slide2-photo-capture.component';
import { Slide5SecondPhotoComponent } from './components/slide5-second-photo/slide5-second-photo.component';
import { Slide6ReviewComponent } from './components/slide6-review/slide6-review.component';
import { Slide7SubmissionComponent } from './components/slide7-submission/slide7-submission.component';
import { Slide9StatusComponent } from './components/slide9-status/slide9-status.component';
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
