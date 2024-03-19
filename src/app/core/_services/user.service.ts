import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = this.storageService.getUser();
  constructor(private storageService: StorageService) { }

  get username(): string | undefined {
    return this.user?.username;
  }
  get userEmial(): string | undefined{
    return this.user?.email;
  }
  
}