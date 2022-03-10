import { Injectable } from '@angular/core';
import { TwitterData } from '../interfaces/covid-data';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TwitterDataService {

  constructor(private http:HttpClient) { }

  getSource(): any {
    return this.http.get<TwitterData[]>("https://8080-28b90df4-0fad-4eb7-9f0c-d9cb88edade9.cs-us-central1-pits.cloudshell.dev/source?key=source");
  }
}
