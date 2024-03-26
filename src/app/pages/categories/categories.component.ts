import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message, MessageService,ConfirmationService  } from 'primeng/api';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class CategoriesComponent {
  form!: FormGroup;
  cateogries: any = [];
  editedCategory!: any;
  edit: boolean = false;
  uploadedFiles: any[] = [];
  messages: Message[] = [];
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
    this.http.get(environment.APIURL + "/api/TourismCategories/GetAll").subscribe({
      next: (res: any) => {
        this.cateogries = res.data;
      }
    })
  }
  editCategory(cat: any) {
    this.form.patchValue(cat);
    this.edit = true;
    this.editedCategory = cat;
  }
  deleteCategory(event: Event, id: number) {
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
          .delete(environment.APIURL + '/api/TourismCategories/Delete?ID=' + id)
          .subscribe({
            next: (res: any) => {
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmed',
                detail: 'Record deleted',
              });
              this.cateogries = this.cateogries.filter((x: any) => x.id !== id);
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
  resetToAdd(){
    this.edit = false;
    this.form.reset();
  }
  submit() {
    if (this.edit) {
      this.edit = false;
      const categoryData = {
        ...this.form.value,
        id: this.editedCategory.id,
        placeCounter: 0,
      };
      this.http
        .put(
          environment.APIURL + '/api/TourismCategories/Update?id=' + this.editedCategory.id,
          categoryData
        )
        .subscribe({
          next: (res: any) => {
            this.messages = [
              { severity: 'success', summary: 'Success', detail: res.message },
            ];
            //update the category
            this.editedCategory = {...this.editedCategory, ...categoryData};
            this.form.reset();
            const index = this.cateogries.findIndex(
              (x : any) => x.id === this.editedCategory.id
            );
            if (index !== -1) {
              this.cateogries[index] = this.editedCategory;
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
      .post(environment.APIURL + '/api/TourismCategories/Add', this.form.value)
      .pipe(
        catchError((error: any) => {
          this.messages = [
            { severity: 'error', summary: 'Error', detail: error.message },
          ];
          return error;
        })
      )
      .subscribe((res: any) => {
        this.cateogries.push(this.form.value);
        this.form.reset();
        this.messages = [ { severity: 'success', summary: 'Success', detail: res.message }]
        this.messageService.add(   { severity: 'success', summary: 'Success', detail: res.message });
      });
    }
  }
}
