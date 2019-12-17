import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const key = environment.API_KEY;
const url = `https://barikoi.xyz/v1/api/search/ward/zone/${key}`;

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private http: HttpClient) { }

  getWardAndZone(longitude, latitude) {
    return this.http.get(`${url}/${longitude}/${latitude}`);
  }
}
