import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  ConfirmationService,
  MessageService,
  ConfirmEventType,
} from 'primeng/api';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class PlaceDetailsComponent {
  placeID: number = 0;
  places: any[] = [];
  placesNames: any = [];
  currentPlaceName: string = '';
  placeImage: string = '';
  detailedDiscription: string = '';
  openTime: string = '';
  closeTime: string = '';
  longitude: string = '';
  latitude: string = '';
  imagesLinkes: string[] = [];
  currentActivity: string = '';
  activites: string[] = [];

  historical: any = false;
  floors: any[] = [];
  floorName: string = '';
  floorNumber: any = null;
  floorImage: string = '';

  rooms: any[] = [];
  roomName: string = '';
  roomNumber: any = null;
  roomImage: string = '';

  action: string = 'create';

  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    console.log(this.allParamData());
    this.http
      .get(environment.APIURL + '/api/Places/GetAll')
      .subscribe((res: any) => {
        this.places = res.data;
        this.placesNames = this.places.map((place) => place.name);
      });
  }

  onSelectPlace(event: any) {
    let selectedPlace = this.places.find((place) => place.name === event.value);

    if (selectedPlace) {
      this.placeID = selectedPlace.id;
      this.historical = selectedPlace.cstegoryName === 'Cultural Tourism';
    } else {
      console.error('Place not found:', event.value);
    }
    console.log(this.placeID, ' ');
  }

  getMainDetails(): any {
    const param = {
      placeId: this.placeID,
      detailedDescription: this.detailedDiscription,
      openTime: this.openTime,
      closeTime: this.closeTime,
      latitude: this.latitude,
      longitude: this.longitude,
      activities: this.activites,
      imagesLinks: this.imagesLinkes,
    };

    return param;
  }

  getHistoricalDetails(): any {
    const param = {
      floors: this.floors,
    };

    return param;
  }

  addFloor(): void {
    if(this.floorName === '' || this.floorNumber === null || this.floorImage === '' || this.rooms.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Please fill all floor details',
      });
      return;
    }
    const floor = {
      floorNumber: this.floorNumber,
      floorName: this.floorName,
      floorImageLink: this.floorImage,
      rooms: this.rooms,
    };
    this.floors.push(floor);
    this.floorName = '';
    this.floorNumber = null;
    this.floorImage = '';
    this.rooms = [];
  }

  addRoom(): void {
    if(this.roomName === '' || this.roomNumber === null || this.roomImage === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Please fill all room details',
      });
      return;
    }
    const room = {
      roomNumber: this.roomNumber,
      roomName: this.roomName,
      roomImageLink: this.roomImage,
    };

    this.rooms.push(room);
    this.roomName = '';
    this.roomNumber = null;
    this.roomImage = '';
  }
  addImage() {
    if(this.placeImage === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Please fill image feild',
      });
      return;
    }
    this.imagesLinkes.push(this.placeImage);
    this.placeImage = '';
  }
  addActivity() {
    if(this.currentActivity === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Please fill activity feild',
      });
      return;
    }
    this.activites.push(this.currentActivity);
    this.currentActivity = '';
  }

  allParamData() {
    const params = {
      ...this.getMainDetails,
      ...this.floors,
    };
  }

  checkDataValidation(): boolean {
    let isValid = true;
    Object.values(this.getMainDetails()).forEach((element: any) => {
      if (
        element === '' ||
        element === null ||
        element === undefined ||
        (typeof element === 'object' && element.length === 0)
      ) {
        isValid = false;
      }
    });
    if(!this.historical) {
      return isValid;
    }
    Object.values(this.getHistoricalDetails()).forEach((element: any) => {
      if (
        element === '' ||
        element === null ||
        element === undefined ||
        element === -1 ||
        (typeof element === 'object' && element.length === 0)
      ) {
        isValid = false;
      }
    });
    return isValid;
  }

  submit() {
    console.log(this.allParamData());
    if (!this.checkDataValidation()){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all details',
      });
      return
    }

  }
}
