import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { AuthenticationService } from 'src/app/core/_services/authentication.service';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent {
  constructor(private auth: AuthenticationService){

  }
  logout(){
    this.auth.logout();
  }
}

