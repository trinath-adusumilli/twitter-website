import { Injectable } from '@angular/core';
import { TwitterData } from '../interfaces/covid-data';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TwitterDataService {

  constructor(private http:HttpClient) { }

  getSource(): any {
    return this.http.get<TwitterData[]>("http://localhost:8080/source?key=source");
  }
}
