import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { catchError, map, pipe } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ConfirmationService,
  MessageService,
  ConfirmEventType,
} from 'primeng/api';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class PlacesComponent {
  @ViewChild('dt') dt!: Table;
  form!: FormGroup;
  cities: { name: string; id: number }[] = [];
  messages: Message[] = [];
  Categories: { name: string; id: number }[] = [];
  places: place[] = [];
  edit: boolean = false;
  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      imageLink: new FormControl('', Validators.required),
      categoryId: new FormControl('', Validators.required),
      cityId: new FormControl('', Validators.required),
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
      .get(environment.APIURL + '/api/TourismCategories/GetAll')
      .pipe(
        map((res: any) => {
          this.Categories = res.data;
        }),
        catchError((error: any) => {
          console.log('error', error);
          throw error;
        })
      )
      .subscribe((res) => {});

    this.http
      .get(environment.APIURL + '/api/CityCategory/GetAll')
      .pipe(
        map((res: any) => {
          this.cities = res.data;
        }),
        catchError((error: any) => {
          console.log('error', error);
          throw error;
        })
      )
      .subscribe((res) => {});
  }
  editedPlace: place = {} as place;
  editPlace(place: place) {
    this.form.patchValue(place);
    const city = this.cities.find((x) => x.id === place.cityId);
    const category = this.Categories.find((x) => x.id === place.categoryId);
    this.form.get('cityId')?.setValue(city);
    this.form.get('categoryId')?.setValue(category);
    this.edit = true;
    this.editedPlace = place;
  }
  deletePlace(event: Event, id: number) {
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
          .delete(environment.APIURL + '/api/Places/Delete?ID=' + id)
          .subscribe({
            next: (res: any) => {
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmed',
                detail: 'Record deleted',
              });
              this.places = this.places.filter((x) => x.id !== id);
            },
            error: (error: any) => {
              this.messages = [
                { severity: 'error', summary: 'Error', detail: error.message },
              ];
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
  resetToAdd() {
    this.edit = false;
    this.form.reset();
  }
  clear(table: Table) {
    table.clear();
  }
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(value, 'contains');
  }
  submit() {
    const catVal = this.form.get('categoryId')?.value.id;
    const citVal = this.form.get('cityId')?.value.id;
    this.form.get('categoryId')?.setValue(catVal);
    this.form.get('cityId')?.setValue(citVal);
    if (this.edit) {
      this.http
        .put(
          environment.APIURL + '/api/Places/Update?id=' + this.editedPlace.id,
          this.form.value
        )
        .subscribe({
          next: (res: any) => {
            // update the place in the places array
            this.places = this.places.map((x) => {
              if (x.id === this.editedPlace.id) {
                return this.editedPlace;
              }
              return x;
            });
            this.form.reset();
            this.messages = [
              { severity: 'success', summary: 'Success', detail: res.message },
            ];
            //replace the place with the updated one in the places array
            const index = this.places.findIndex(
              (x) => x.id === this.editedPlace.id
            );
            if (index !== -1) {
              this.places[index] = this.editedPlace;
            }
          },
          error: (error: any) => {
            this.messages = [
              { severity: 'error', summary: 'Error', detail: error.message },
            ];
          },
        });
    } else {
      this.http
        .post(environment.APIURL + '/api/Places/Add', this.form.value)
        .pipe(
          catchError((error: any) => {
            console.log('error', error);
            throw error;
          })
        )
        .subscribe((res: any) => {
          this.form.reset();
          this.messages = [
            { severity: 'success', summary: 'Success', detail: res.message },
          ];
          this.places.push(this.form.value as place);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
        });
    }
  }
}

interface place {
  id: number;
  name: string;
  description: string;
  imageLink: string;
  categoryId: number;
  cityId: number;
  rate: number;
  rateCount: number;
}
