import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [MessageService],
})
export class CategoriesComponent {
  form!: FormGroup;
  cities: {name: string, id: number}[] = [];
  uploadedFiles: any[] = [];
  messages: Message[] = [];
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      imageUrl: new FormControl('', Validators.required),
    });
  }
  ngOnInit() {
  }
  submit() {
    this.http
      .post(environment.APIURL + '/api/TourismCategories/Add', this.form.value)
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
