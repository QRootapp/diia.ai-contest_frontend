import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { GeoLocation } from '../models/violation.model';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor() {}

  getCurrentPosition(): Observable<GeoLocation> {
    // Try to get real geolocation, fallback to mock if not available or denied
    return from(
      new Promise<GeoLocation>((resolve) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.warn('Geolocation error, using mock data:', error);
              // Mock location (Kyiv center)
              resolve({
                latitude: 50.4501,
                longitude: 30.5234,
              });
            },
            {
              enableHighAccuracy: true,
              timeout: 5000, // Reduced timeout for faster fallback
              maximumAge: 0,
            }
          );
        } else {
          console.warn('Geolocation not available, using mock data');
          resolve({
            latitude: 50.4501,
            longitude: 30.5234,
          });
        }
      })
    );
  }

  formatCoordinates(location: GeoLocation): string {
    return `${location.latitude.toFixed(4)}° N, ${location.longitude.toFixed(
      4
    )}° E`;
  }

  isLocationValid(location: GeoLocation): boolean {
    return location.latitude !== 0 && location.longitude !== 0;
  }
}
