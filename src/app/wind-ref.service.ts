import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindRefService {

  constructor() { }

  // returns single reference to the DOM window object
  getNativeWindow(): any {
    return window;
  }
}
