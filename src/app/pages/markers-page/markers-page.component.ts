import { AfterViewInit, Component, ElementRef, signal, viewChild } from '@angular/core';
import maplibregl, { LngLatLike, Marker } from 'maplibre-gl';
import { environment } from '../../../environments/environment.development';
import {v4 as UUID} from 'uuid'
import { CommonModule, JsonPipe } from '@angular/common';

interface MarkerCustom {
  id: string,
  maplibreMarker: maplibregl.Marker
}

@Component({
  selector: 'app-markers-page',
  imports: [CommonModule],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit{
  divElement = viewChild<ElementRef>('map');
  map = signal<maplibregl.Map|null>(null)
  key = environment.mapApiKey
  markers = signal<MarkerCustom[]>([])

  async ngAfterViewInit(){
      if(!this.divElement()?.nativeElement) return
      const element = this.divElement()!.nativeElement;
      await new Promise((resolve) => setTimeout(resolve, 80))

      const map = new maplibregl.Map({
        container: element, // container id
        style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${this.key}`, // style URL
        center: [-0.37,39.4719], // starting position [lng, lat]
        zoom: 13// starting zoom
      });


      this.mapListeners(map)
    };

    mapListeners(map: maplibregl.Map) {
      map.on('click', (event) => {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        const marker = new maplibregl.Marker({draggable: true, color: randomColor})
          .setLngLat(event.lngLat)
          .addTo(map);

        const newMarker: MarkerCustom = {
          id: UUID(),
          maplibreMarker: marker
        }

        this.markers.set([newMarker, ...this.markers()])
        console.log(this.markers())
      });
      this.map.set(map);



    }

    flyToMarker(lngLat: LngLatLike){
      if(!this.map()) return
      this.map()?.flyTo({
        center:lngLat}
      )
    }

    deleteMarker(marker: MarkerCustom) {
      if(!this.map()) return
      const map = this.map()
      marker.maplibreMarker.remove()
      this.markers.set(this.markers().filter(m => m.id != marker.id))
    }

}
