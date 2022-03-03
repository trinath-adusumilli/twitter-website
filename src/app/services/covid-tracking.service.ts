import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CovidData } from '../interfaces/covid-data';

@Injectable({
  providedIn: 'root'
})
export class CovidTrackingService {

  constructor(private http: HttpClient) { }

  getData(): any {
    //let covidData : CovidData[] = [] 
    // this.http.get<CovidData[]>("https://api.covidtracking.com/v1/states/current.json").subscribe((data) => {     
    // //console.log(data);
    //   data.forEach(element => {
    //     covidData.push({
    //       date: element.date,
    //       state: element.state,
    //       negative: element.negative,
    //       positive: element.positive,
    //       probableCases: element.probableCases
    //     })
    //   });       
    // });
    // return covidData;
    return this.http.get<CovidData[]>("https://api.covidtracking.com/v1/states/current.json");
  }
}
