import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IUser } from '../_view-models/iuser';

import { StorageService } from './storage.service';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userSubject: BehaviorSubject<IUser | null>;
  public user: Observable<IUser | null>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.userSubject = new BehaviorSubject<IUser | null>(
      this.storageService.getUser() as IUser | null
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(
    username: string,
    password: string,
  ): Observable<IUser> {
    console.log('user', username, password);
    return this.http
      .post<any>(`${environment.APIURL}/api/Adminstration/Login`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          this.storageService.saveUser(user);
          this.userSubject.next(user);
          this.router.navigate(['/dashboard']);
          return user;
        }
        ),
        catchError((error) => {
          console.log('error', error);
          throw error;
        })
      );
  }

  logout() {
    this.storageService.clean();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
