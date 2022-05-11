import { Component, OnInit } from '@angular/core';
import * as am5core from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy'
import * as am5map from '@amcharts/amcharts5/map';
import * as am5geodata_usaLow from '@amcharts/amcharts5-geodata/usaLow';
//import am5themes_Animated from '@amcharts/amcharts5/themes/animated';
import { CovidTrackingService } from 'src/app/services/covid-tracking.service';
import { CovidData, TwitterData } from 'src/app/interfaces/covid-data';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  CovidData: CovidData[] = [];
  root: any;
  constructor(private trackingSevice: CovidTrackingService) { }

  fillCovidData(type: string): any[] {
    let data: any[] = [];

    this.CovidData.forEach(element => {
      data.push({
        id: "US-" + element.state,
        value: type == "positive"
          ? element.positive
          : type == "negative"
            ? element.negative
            : element.probableCases
      });
    });
    //console.log(this.CovidData);
    return data;
  }

  createMap(type: string) {
    console.log(type);

    if(this.root != null)
      this.root.dispose();

    this.root = am5core.Root.new("mapdiv");

    // Set themes
    // this.root.setThemes([
    //   am5themes_Animated.new(this.root)
    // ]);

    // Create chart
    let chart = this.root.container.children.push(am5map.MapChart.new(this.root, {
      panX: "rotateX",
      panY: "none",
      projection: am5map.geoAlbersUsa(),
      layout: this.root.horizontalLayout
    }));

    // Create polygon series
    let polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(this.root, {
      geoJSON: am5geodata_usaLow.default,
      valueField: "value",
      calculateAggregates: true
    }));

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}: {value}"
    });

    polygonSeries.set("heatRules", [{
      target: polygonSeries.mapPolygons.template,
      dataField: "value",
      min: am5core.color(0xffd000),
      max: am5core.color(0xff0000),
      key: "fill"
    }]);

    polygonSeries.mapPolygons.template.events.on("pointerover", function (ev: { target: { dataItem: { get: (arg0: string) => any; }; }; }) {      
      heatLegend.showValue(ev.target.dataItem.get("value"));
    });

    polygonSeries.data.setAll(this.fillCovidData(type));

    let heatLegend = chart.children.push(am5core.HeatLegend.new(this.root, {
      orientation: "vertical",
      startColor: am5core.color(0xffd000),
      endColor: am5core.color(0xff0000),
      startText: "Lowest",
      endText: "Highest",
      stepCount: 5
    }));

    heatLegend.startLabel.setAll({
      fontSize: 12,
      fill: heatLegend.get("startColor")
    });

    heatLegend.endLabel.setAll({
      fontSize: 12,
      fill: heatLegend.get("endColor")
    });

    // change this to template when possible
    polygonSeries.events.on("datavalidated", function () {
      heatLegend.set("startValue", polygonSeries.getPrivate("valueLow"));
      heatLegend.set("endValue", polygonSeries.getPrivate("valueHigh"));
    });
  }  

  ngOnInit(): void {
        
    this.trackingSevice.getData().subscribe((data: CovidData[]) => {
      this.CovidData = data;
      this.createMap("positive");
    });

   // this.trackingSevice.readJson();

  }
  
}
