import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  ConfirmationService,
  MessageService,
  Message,
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

  messages: Message[] = [];

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
    console.log(this.openTime, typeof this.openTime);
    const startTime = this.openTime.toString().split(' ').at(4);
    const endTime = this.closeTime.toString().split(' ').at(4);
    const param = {
      placeId: this.placeID,
      detailedDescription: this.detailedDiscription,
      openTime: startTime,
      closeTime: endTime,
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
    if (
      this.floorName === '' ||
      this.floorNumber === null ||
      this.floorImage === '' ||
      this.rooms.length === 0
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Please fill all floor details',
      });
      return;
    }
    console.log('floor suc');
    const floor = {
      floorNumber: this.floorNumber,
      floorName: this.floorName,
      floorImageLink: this.floorImage,
      rooms: this.rooms,
    };
    this.floors.push(floor);
    this.resetAttr();
  }
  resetAttr() {
    this.floorName = '';
    this.floorNumber = null;
    this.floorImage = '';
    this.rooms = [];
    this.latitude = '';
    this.longitude = '';
    this.openTime = '';
    this.closeTime = '';
    this.detailedDiscription = '';
    this.imagesLinkes = [];
    this.activites = [];
    this.currentActivity = '';
    this.placeImage = '';
    this.roomName = '';
    this.roomNumber = null;
    this.roomImage = '';
  }
  addRoom(): void {
    if (
      this.roomName === '' ||
      this.roomNumber === null ||
      this.roomImage === ''
    ) {
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
    if (this.placeImage === '') {
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
    if (this.currentActivity === '') {
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
      ...this.getMainDetails(),
      floors: this.floors,
    };
    console.log('param\n', params);
    return params;
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
    if (!this.historical) {
      return isValid;
    }
    Object.values(this.getHistoricalDetails()).forEach((element: any) => {
      if (
        element === '' ||
        element === null ||
        element === undefined ||
        (typeof element === 'object' && element.length === 0)
      ) {
        isValid = false;
      }
    });
    return isValid;
  }
  
  deletePlaceDetails() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.http
          .delete(environment.APIURL + '/api/PlaceDetails/DeleteByPlaceID?ID=' + this.placeID)
          .subscribe({
            next: (res: any) => {
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmed',
                detail: 'Record deleted',
              });
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
      // Reset the model values
      this.floorName = '';
      this.floorNumber = null; // Assuming floorNumber is a number, set it to null
      this.floorImage = '';
      this.roomName = '';
      this.roomNumber = null; // Assuming roomNumber is a number, set it to null
      this.roomImage = '';
      this.currentActivity = '';
      this.placeImage = '';
      this.longitude = '';
      this.latitude = '';
      this.detailedDiscription = '';
      this.openTime = ''; // Assuming openTime is a date/time, set it to null
      this.closeTime = ''; // Assuming closeTime is a date/time, set it to null
  }

  submit() {
    console.log(this.allParamData());
    if (!this.checkDataValidation()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all details',
      });
      return;
    }
    this.http
      .post(environment.APIURL + '/api/PlaceDetails/Add', this.allParamData())
      .subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Place Added Succesfully',
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.messege,
          });
        }
      );
      this.floorName = '';
      this.floorNumber = null; // Assuming floorNumber is a number, set it to null
      this.floorImage = '';
      this.roomName = '';
      this.roomNumber = null; // Assuming roomNumber is a number, set it to null
      this.roomImage = '';
      this.currentActivity = '';
      this.placeImage = '';
      this.longitude = '';
      this.latitude = '';
      this.detailedDiscription = '';
      this.openTime = ''; // Assuming openTime is a date/time, set it to null
      this.closeTime = ''; // Assuming closeTime is a date/time, set it to null
  }
}
