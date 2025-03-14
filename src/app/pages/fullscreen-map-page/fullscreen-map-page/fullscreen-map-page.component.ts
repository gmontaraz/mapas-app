import { AfterViewInit, Component, effect, ElementRef, Pipe, signal, viewChild } from '@angular/core';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { environment } from '../../../../environments/environment.development';
import { CommonModule, JsonPipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [JsonPipe, CommonModule],
  templateUrl: './fullscreen-map-page.component.html',
  styles: `
    div{
      width: 100vw;
      height: calc(100vh - 64px);
    }

    #controls {
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      position: fixed;
      bottom: 25px;
      right: 20px;
      z-index: 9999;
      box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);
      border: 1px solid #e2e8f0;
      width: 250px;
    }
  `
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<maplibregl.Map|null>(null)
  zoom = signal(5)
  key = environment.mapApiKey
  coordinates = signal({
    lng: 40,
    lat: -3
  })
  zoomEffect = effect(() => {
    if(!this.map()) return
    this.map()!.zoomTo(this.zoom())
  })

  async ngAfterViewInit(){
    if(!this.divElement()?.nativeElement) return
    const element = this.divElement()!.nativeElement;
    await new Promise((resolve) => setTimeout(resolve, 80))

    const map = new maplibregl.Map({
      container: element, // container id
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${this.key}`, // style URL
      center: [this.coordinates().lat, this.coordinates().lng], // starting position [lng, lat]
      zoom: this.zoom()// starting zoom
    });
    this.mapListeners(map)
  };

  mapListeners(map: maplibregl.Map){
    map.on('zoomend', () => {
      this.zoom.set(map.getZoom())
    })

    map.on('moveend', () => {
      const center = map.getCenter()
      this.coordinates.set(center)
    })

    map.on('load', () => {
      console.log('Map Loaded')
    })

    this.map.set(map)
  }
}
