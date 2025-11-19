export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface PhotoData {
  imageData: string; // base64 or blob URL
  timestamp: Date;
  geoLocation: GeoLocation;
  fileName: string;
}

export interface ViolationSession {
  sessionId: string;
  firstPhoto: PhotoData;
  secondPhoto?: PhotoData;
  licensePlate?: string;
  address?: string;
  status: 'pending' | 'validated' | 'submitted' | 'active';
  duration?: number; // in seconds
}

export interface SubmissionData {
  sessionId: string;
  userFullName: string;
  userPhone: string;
  licensePlate: string;
  address: string;
  violationDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  photos: PhotoData[];
  gpsMetadata: GeoLocation;
}

export interface AIValidationResponse {
  sessionId: string;
  licensePlate: string;
  isValidViolation: boolean;
  confidence: number;
  violationType: string;
  message: string;
}

export interface StatusUpdate {
  status: string;
  timestamp: Date;
  description: string;
  completed: boolean;
}

export interface CaseStatus {
  caseId: string;
  licensePlate: string;
  submittedAt: Date;
  status:
    | 'active'
    | 'under_review'
    | 'decision_pending'
    | 'resolution_issued'
    | 'fine_applied';
  updates: StatusUpdate[];
}
