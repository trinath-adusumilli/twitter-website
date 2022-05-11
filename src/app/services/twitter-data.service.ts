import { Injectable } from '@angular/core';
import { TwitterData } from '../interfaces/covid-data';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../global-variable';

@Injectable({
  providedIn: 'root'
})
export class TwitterDataService {

  apiDomain= GlobalConstants.apiDomain;
  apiPort = GlobalConstants.apiPort;

  apiURL = this.apiDomain+ ":"+this.apiPort;

  constructor(private http:HttpClient) { }

  getSource(): any {
    return this.http.get<TwitterData[]>(this.apiURL + "/source?key=source");
  }

  getModelResult(): any {
    return this.http.get<TwitterData[]>(this.apiURL + "/source?key=model_label_result");
  }

  getWeeklyAvgPositiveCases(year: string): any {
    return this.http.get<any[]>(this.apiURL + "/dailyPositiveNumber?year="+year);
  }

  getRelatedWords(word: string): any {
    return this.http.get<any[]>( this.apiURL + "/relatedWords?word="+word);
  }
  
}
