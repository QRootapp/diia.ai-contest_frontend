import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

export interface CapturedPhoto {
  file: File;
  previewUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  constructor() {}

  capturePhoto(): Observable<CapturedPhoto> {
    return from(
      new Promise<CapturedPhoto>((resolve, reject) => {
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

  private captureFromCamera(): Promise<CapturedPhoto> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Use back camera

      input.onchange = (event: any) =>
        this.handleFileSelection(event, resolve, reject);

      input.click();
    });
  }

  private captureFromFile(): Promise<CapturedPhoto> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = (event: any) =>
        this.handleFileSelection(event, resolve, reject);

      input.click();
    });
  }

  private handleFileSelection(
    event: Event,
    resolve: (value: CapturedPhoto | PromiseLike<CapturedPhoto>) => void,
    reject: (reason?: any) => void
  ) {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        reject('Розмір файлу перевищує 20 МБ');
        return;
      }
      this.fileToBase64(file)
        .then((previewUrl) => resolve({ file, previewUrl }))
        .catch(reject);
    } else {
      reject('No file selected');
    }
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
