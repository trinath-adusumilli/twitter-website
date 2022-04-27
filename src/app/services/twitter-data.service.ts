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

  getModelResult(): any {
    return this.http.get<TwitterData[]>("http://localhost:8080/source?key=model_label_result");
  }

  getWeeklyAvgPositiveCases(year: string): any {
    return this.http.get<any[]>("http://localhost:8080/dailyPositiveNumber?year="+year);
  }

  getRelatedWords(word: string): any {
    return this.http.get<any[]>("http://localhost:8080/relatedWords?word="+word);
  }
  
}
