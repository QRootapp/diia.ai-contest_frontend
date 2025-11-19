import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  constructor() {}

  capturePhoto(): Observable<string> {
    return from(
      new Promise<string>((resolve, reject) => {
        // Check if we're on mobile with camera support
        if (this.isMobileDevice() && 'mediaDevices' in navigator) {
          this.captureFromCamera()
            .then(resolve)
            .catch(() => {
              this.captureFromFile().then(resolve).catch(reject);
            });
        } else {
          // Desktop or fallback - use file input
          this.captureFromFile().then(resolve).catch(reject);
        }
      })
    );
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  private captureFromCamera(): Promise<string> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Use back camera

      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          this.fileToBase64(file).then(resolve).catch(reject);
        } else {
          reject('No file selected');
        }
      };

      input.click();
    });
  }

  private captureFromFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          this.fileToBase64(file).then(resolve).catch(reject);
        } else {
          reject('No file selected');
        }
      };

      input.click();
    });
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
