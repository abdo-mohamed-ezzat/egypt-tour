import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message, MessageService,ConfirmationService  } from 'primeng/api';
import { catchError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class CitiesComponent {
  form!: FormGroup;
  cities: any = [];
  uploadedFiles: any[] = [];
  messages: Message[] = [];
edit: boolean = false;
editedCity: any;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private http: HttpClient
  ) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      imageLink: new FormControl('', Validators.required),
    });
  }
  ngOnInit() {
    this.http.get(environment.APIURL + "/api/CityCategory/GetAll").subscribe({
      next: (res: any) => {
        this.cities = res.data;
      }
    })
  }
  resetToAdd(){
    this.edit = false;
    this.form.reset();
  }
  editCity(city: any) {
    this.form.patchValue(city);
    this.edit = true;
    this.editedCity = city;
  }
  delteCity(event: Event, id: number) {
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
          .delete(environment.APIURL + '/api/CityCategory/Delete?ID=' + id)
          .subscribe({
            next: (res: any) => {
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmed',
                detail: 'Record deleted',
              });
              this.cities = this.cities.filter((x: any) => x.id !== id);
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
  submit() {
    if (this.edit) {
      this.edit = false;
      this.http
        .put(
          environment.APIURL + '/api/Places/Update?id=' + this.editedCity.id,
          this.form.value
        )
        .subscribe({
          next: (res: any) => {
            this.messages = [
              { severity: 'success', summary: 'Success', detail: res.message },
            ];
            //replace the place with the updated one in the places array
            const index = this.cities.findIndex(
              (x : any) => x.id === this.editedCity.id
            );
            if (index !== -1) {
              this.cities[index] = this.editedCity;
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
      .post(environment.APIURL + '/api/CityCategory/Add', this.form.value)
      .pipe(
        catchError((error: any) => {
          console.log('error', error);
          throw error;
        })
      )
      .subscribe((res: any) => {
        this.form.reset();
        this.messages = [ { severity: 'success', summary: 'Success', detail: res.message }]
        this.messageService.add(   { severity: 'success', summary: 'Success', detail: res.message });
      });
    }
  }
}
