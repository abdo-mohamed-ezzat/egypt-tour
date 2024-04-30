import { Component } from '@angular/core';
import {
  ConfirmationService,
  MessageService,
  ConfirmEventType,
} from 'primeng/api';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Message } from 'primeng/api';
import { catchError, map, pipe } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-ready-plans',
  templateUrl: './ready-plans.component.html',
  styleUrls: ['./ready-plans.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class ReadyPlansComponent {
  form!: FormGroup;
  places!: Place[];
  edit: boolean = false;
  days!: any[];
  messages: Message[] = [];
  trips: any[] = [];
  disabled: boolean = true;
  tripPlaces: { day: number; id: number }[] = [];
  placesIDs!: any[];
  dayNums!: any[];
  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.form = new FormGroup({
      nameOfTrip: new FormControl('', Validators.required),
      duration: new FormControl('', Validators.required),
      placesIDs: new FormControl([], Validators.required),
      dayNums: new FormControl([], Validators.required),
      currentDay: new FormControl('', Validators.required),
      currentPlace: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.http
      .get(environment.APIURL + '/api/Places/GetAll')
      .pipe(
        map((res: any) => {
          this.places = res.data;
        })
      )
      .subscribe((res: any) => {});

    this.http
      .get(environment.APIURL + '/api/ReadyTrips/GetTrips')
      .pipe(
        map((res: any) => {
          this.trips = res.data;
        })
      )
      .subscribe((res: any) => {});
  }

  resetToAdd() {
    this.edit = false;
    this.form.reset();
  }

  editTrip(trip: any) {}
  deleteTrip(event: Event, id: any) {
    console.log(event);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.http
          .delete(environment.APIURL + '/api/ReadyTrips/Delete?ID=' + id)
          .subscribe({
            next: (res: any) => {
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmed',
                detail: 'Record deleted',
              });

              this.trips = this.trips.filter((x) => x.id !== id);
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message,
              });
            },
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }

  setTripFormValue() {
    this.tripPlaces.sort((a, b) => a.day - b.day);
    this.placesIDs = this.tripPlaces.map((p) => p.id);
    this.dayNums = this.tripPlaces.map((p) => p.day);
    this.form.get('placesIDs')?.setValue(this.placesIDs);
    this.form.get('dayNums')?.setValue(this.dayNums);
  }

  submit() {
    this.setTripFormValue();
    const data = {
      nameOfTrip: this.form.get('nameOfTrip')?.value,
      duration: this.form.get('duration')?.value,
      countOfPlaces: this.tripPlaces.length,
      placesID: this.placesIDs,
      dayNums: this.dayNums,
    };
    if (!this.edit) {
      if (this.form.valid) {
        this.http
          .post(environment.APIURL + '/api/ReadyTrips/Add', data)
          .subscribe(
            (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Trip Added Succesfully',
              });
              this.form.reset();
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error.messege,
              });
            }
          );
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Enter All Feilds',
        });
      }
    } else {
      if (this.form.valid) {
        this.http
          .put(environment.APIURL + '/api/ReadyTrips/Update', data)
          .subscribe(
            (response) => {
              console.log('Response from the server', response);
            },
            (error) => {
              console.log('Error', error);
            }
          );
      } else {
        console.log(data);
        console.log('Form is not valid');
      }
    }
  }
  setDayNumber() {
    const dayNums = this.form.get('duration')?.value;
    this.days = Array.from({ length: dayNums }, (_, i) => i + 1);
    this.disabled = false;
  }
  setDayPlace() {
    const day = this.form.get('currentDay')?.value;
    const place = this.form.get('currentPlace')?.value;
    this.tripPlaces.push({ day, id: place.id });
    console.log(this.tripPlaces);
  }
}

interface Place {
  id: number;
  name: string;
  description: string;
  imageLink: string;
  categoryId: number;
  cityId: number;
  rate: number;
  rateCount: number;
}
