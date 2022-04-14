import { Injectable } from '@angular/core';
import { TwitterData } from '../interfaces/covid-data';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TwitterDataService {

  constructor(private http:HttpClient) { }

  getSource(): any {
    return this.http.get<TwitterData[]>("https://twitter-data-backend.uc.r.appspot.com/source?key=source");
  }

  getModelResult(): any {
    return this.http.get<TwitterData[]>("https://twitter-data-backend.uc.r.appspot.com/source?key=model_label_result");
  }
}
