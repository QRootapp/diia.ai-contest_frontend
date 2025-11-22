import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { ViolationStateService } from '../services/violation-state.service';

export const sessionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const stateService = inject(ViolationStateService);

  const session = stateService.getSession();
  const path = route.routeConfig?.path;

  // Allow capture-first-photo without session (it creates the session)
  if (path === 'capture-first-photo') {
    return true;
  }

  // Check if session exists for all other routes
  if (!session) {
    console.warn('No session found, redirecting to intro');
    router.navigate(['/intro']);
    return false;
  }

  if (
    path === 'capture-second-photo' ||
    path === 'review' ||
    path === 'submit'
  ) {
    if (!session.firstPhoto) {
      console.warn('No first photo found, redirecting to capture');
      router.navigate(['/capture-first-photo']);
      return false;
    }
  }

  // For review and submit, need second photo
  if (path === 'review' || path === 'submit') {
    if (!session.secondPhoto) {
      console.warn(
        'No second photo found, redirecting to capture second photo'
      );
      router.navigate(['/capture-second-photo']);
      return false;
    }
  }

  return true;
};

export const statusGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const stateService = inject(ViolationStateService);

  const caseId = route.paramMap.get('caseId');
  const session = stateService.getSession();

  if (caseId) {
    return true;
  }

  if (session?.backendReport?.id) {
    router.navigate(['/status', session.backendReport.id]);
    return false;
  }

  router.navigate(['/my-applications']);
  return false;
};
