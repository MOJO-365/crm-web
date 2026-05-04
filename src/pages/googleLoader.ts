/// <reference types="google.maps" />
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: 'AIzaSyBu9d3JG39GnoTY5SMr5-gkx3qqjA6Dh2g',
  // apiKey: 'AIzaSyDUCJi-4pQo8kxOzJMtmrn4sVasOMN3jhI',
  version: 'weekly',
  libraries: ['places'],
});

export async function loadPlaces() {
  await loader.load();
  return (window as any).google as typeof google;
}
