import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { GeolocationService } from './services/geolocation/geolocation.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map!: L.Map;

  constructor(private geolocationService: GeolocationService){}

  public ngOnInit(): void {
    this.initializeMap();

    this.geolocationService.getCurrentLocation()
      .then((position) => {this.zoomToLocation(position)})
      .catch(console.error);
  }

  private initializeMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  private zoomToLocation(position: GeolocationPosition): void {
    this.map.panTo([position.coords.latitude, position.coords.longitude]);
  }
}
