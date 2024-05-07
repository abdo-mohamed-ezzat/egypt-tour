import { Component } from '@angular/core';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.scss']
})
export class PlaceDetailsComponent {
  places: any[] = [];
  placesNames: any = [];
  
  detailedDiscription: string = '';
  openDate: string = '';
  closeDate: string = '';
  longitude: string = '';
  latitude: string = '';
  currentImage: string = '';
  imagesLinkes: string[] = [];
  currentActivity: string = '';
  activites: string[] = [];

  historical: any = false;
  floores: any[] = [];
  floorName: string = '';
  floorNumber: string = '';
  floorImage: string = '';
  




}
