import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slide8-integration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide8-integration.component.html',
  styleUrls: ['./slide8-integration.component.scss'],
})
export class Slide8IntegrationComponent {
  constructor(private router: Router) {}

  viewStatus(): void {
    this.router.navigate(['/status']);
  }
  steps = [
    {
      number: 1,
      icon: 'mobile-alt',
      title: 'Доступ до сервісу',
      description:
        "На головному екрані або в розділі «Послуги» з'являється опція «Порушення парковки»",
      color: '#4169e1',
    },
    {
      number: 2,
      icon: 'camera',
      title: 'Фото фіксація',
      description:
        'Натискання відкриває камеру. Користувач робить фото автомобіля, номерного знаку та знаку місця для людей з інвалідністю',
      color: '#9c27b0',
    },
    {
      number: 3,
      icon: 'check-circle',
      title: 'Автоматичне розпізнавання',
      description:
        'Додаток автоматично визначає поточну адресу і розпізнає номерний знак. Система може попросити зробити друге фото за кілька хвилин',
      color: '#4caf50',
    },
    {
      number: 4,
      icon: 'file-signature',
      title: 'Дія.Підпис та відправка',
      description:
        'Формується офіційне звернення про правопорушення. Користувач підписує його Дія.Підписом. Звернення надсилається до Нацполіції',
      color: '#ff9800',
    },
    {
      number: 5,
      icon: 'bell',
      title: 'Відстеження статусу',
      description:
        'Користувач може відстежувати статус розгляду звернення у додатку (прийнято до розгляду, винесено постанову тощо)',
      color: '#00bcd4',
    },
  ];
}
