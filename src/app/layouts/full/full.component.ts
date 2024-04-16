import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { AuthenticationService } from 'src/app/core/_services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent {
  constructor(private auth: AuthenticationService, private http: HttpClient){
    this.http.get(environment.APIURL + '/api/Adminstration/CheckToken').subscribe((res: any) => {})
  }
  logout(){
    this.auth.logout();
  }
}

