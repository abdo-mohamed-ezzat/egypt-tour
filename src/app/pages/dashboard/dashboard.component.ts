import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  data: any;
  data2: any;
  options2: any;
  options: any;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          type: 'bar',
          label: 'Cultural tourism',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          data: [50, 25, 12, 48, 90, 76, 42],
        },
        {
          type: 'bar',
          label: 'Medical tourism',
          backgroundColor: documentStyle.getPropertyValue('--green-500'),
          data: [21, 84, 24, 75, 37, 65, 34],
        },
        {
          type: 'bar',
          label: 'religious tourism',
          backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
          data: [41, 52, 24, 74, 23, 21, 32],
        },
        {
          type: 'bar',
          label: 'leisure tourist',
          backgroundColor: documentStyle.getPropertyValue('--green-200'),
          data: [21, 56, 24, 44, 23, 11, 52],
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
    this.data2 = {
      labels: ['Cairo', 'Alex', 'Luxor', 'Aswan', 'Sinai', 'Siwa', 'Hurghada'],
      datasets: [
          {
              data: [300, 50, 100, 70, 120, 140, 180],
              backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
              hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
          }
      ]
  };


  this.options2 = {
      cutout: '60%',
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      }
  };
  }


}
