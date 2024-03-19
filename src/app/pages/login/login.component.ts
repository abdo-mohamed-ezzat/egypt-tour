import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/_services/authentication.service';
import { Message, MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export class LoginComponent {
  form!: FormGroup;
  loading = false;
  constructor(
    private auth: AuthenticationService,
    private messageService: MessageService
  ) {
    this.form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
  messages: Message[] = [];
  login() {
    this.loading = true;
    this.auth
      .login(this.form.value.username, this.form.value.password)
      .subscribe({
        next: () => {
          this.loading = false;
        },
        error: (error) => {
          console.log('error', error);
          this.loading = false;
          this.messages = [
            { severity: 'error', summary: 'Error', detail: 'Wrong username or password' },
          ];
        },
      });
  }
}
