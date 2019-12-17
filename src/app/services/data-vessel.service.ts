import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataVesselService {
  private address = new Subject<any>();

  constructor() { }


  sendMessage(address: {}) {
      this.address.next(address);
  }

  clearMessages() {
      this.address.next();
  }

  getMessage(): Observable<any> {
    return this.address.asObservable();
  }
}
