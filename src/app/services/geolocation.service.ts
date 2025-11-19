import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { GeoLocation } from '../models/violation.model';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor() {}

  getCurrentPosition(): Observable<GeoLocation> {
    // Always try to get real geolocation, reject if not available
    return from(
      new Promise<GeoLocation>((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.error('Geolocation error:', error);
              reject(new Error('Не вдалося отримати координати GPS'));
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        } else {
          console.error('Geolocation not available');
          reject(new Error('GPS недоступний на цьому пристрої'));
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
