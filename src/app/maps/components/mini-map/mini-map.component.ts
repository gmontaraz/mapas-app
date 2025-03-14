import { Component, ElementRef, input, signal, viewChild } from '@angular/core';
import maplibregl, { LngLatLike } from 'maplibre-gl';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
  styles: `
    div{
      width: 100%;
      height: 260px;
    }
  `
})
export class MiniMapComponent {
  divElement = viewChild<ElementRef>('map');
  map = signal<maplibregl.Map|null>(null)
  key = environment.mapApiKey
  coords =  input.required<{lng: number, lat: number}>()

  async ngAfterViewInit(){
      if(!this.divElement()?.nativeElement) return
      const element = this.divElement()!.nativeElement;
      await new Promise((resolve) => setTimeout(resolve, 80))

      const map = new maplibregl.Map({
        container: element, // container id
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${this.key}`, // style URL
        center: this.coords(),
        zoom: 15,
        interactive: false
      });

      new maplibregl.Marker().setLngLat(this.coords()).addTo(map)
  };



}
