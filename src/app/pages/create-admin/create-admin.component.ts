import { Component } from '@angular/core';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { Message } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class CreateAdminComponent {
  form!: FormGroup;
  admins = [];
  selectedAdmin!: any;
  messages: Message[] = [];
  constructor( private http: HttpClient,
    private confirmationService: ConfirmationService, private messageService: MessageService) {
    this.form = new FormGroup(
      {
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required]),
        roleName: new FormControl('admin'),
      },
    );
  }

  isMatch: boolean = true;
  ngOnInit(){

  }

  submit() {
    this.http
    .post(environment.APIURL + '/api/Adminstration/register', this.form.value)
    .pipe(
      catchError((error: any) => {
        this.messages = [
          { severity: 'error', summary: 'Error', detail: error.message },
        ];
        return error;
      })
    )
    .subscribe((res: any) => {
      this.form.reset();
      this.messages = [ { severity: 'success', summary: 'Success', detail: res.message }]
      this.messageService.add(   { severity: 'success', summary: 'Success', detail: res.message });
    });
  }
}

