export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface PlateRecognition {
  plate: string;
  confidence: number;
}

export interface PhotoData {
  previewUrl: string;
  file: File | null;
  timestamp: Date;
  geoLocation: GeoLocation;
  photoUrl?: string;
  analysis?: PlateRecognition;
}

export interface ApplicantInfo {
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
}

export interface ViolationSession {
  draftId: string;
  reportId?: number;
  reportNumber?: string;
  firstPhoto: PhotoData;
  secondPhoto?: PhotoData;
  status: 'draft' | 'ready' | 'submitted';
  duration?: number; // seconds
  applicant?: ApplicantInfo;
  backendReport?: Report;
}

export interface ReportPhoto {
  id: number;
  photo_url: string;
  photo_type: 'initial' | 'confirmation';
  latitude: number | null;
  longitude: number | null;
  taken_at: string;
  ocr_confidence: number | null;
  recognized_plate: string | null;
  created_at: string;
}

export interface Report {
  id: number;
  vehicle_license_plate: string;
  latitude: number;
  longitude: number;
  status: 'draft' | 'submitted' | 'under_review' | 'resolved' | 'rejected';
  first_photo_at: string;
  confirmation_photo_at?: string;
  duration_minutes?: number;
  submitted_at?: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  report_number: string;
  created_at: string;
  updated_at: string;
  photos: ReportPhoto[];
}

export interface ReportsListResponse {
  data: Report[];
  total: number;
  page: number;
  limit: number;
}
