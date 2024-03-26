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
        roleName: new FormControl('admin', [Validators.required]),
      },
      { validators: this.checkPasswords }
    );
  }
  ngOnInit(){

  }
  checkPasswords(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { notSame: true };
    };
  }
  submit() {

  }
}
