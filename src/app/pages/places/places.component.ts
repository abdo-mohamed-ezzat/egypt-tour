import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { catchError, map, pipe } from 'rxjs';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
  providers: [MessageService],
})
export class PlacesComponent {
  form!: FormGroup;
  cities: { name: string; id: number }[] = [];
  messages: Message[] = [];
  Categories: { name: string; id: number }[] = [];
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      imageLink: new FormControl('', Validators.required),
      categoryId: new FormControl('', Validators.required),
      cityId: new FormControl('', Validators.required),
    });

    // this.form.valueChanges.subscribe((value) => {
 
    // });
  }
  ngOnInit() {
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
  submit() {
    const catVal = this.form.get('categoryId')?.value.id;
    const citVal = this.form.get('cityId')?.value.id;
    this.form.get('categoryId')?.setValue(catVal);
    this.form.get('cityId')?.setValue(citVal);
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
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
      });
  }
}
