import { Component, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5/';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/animated';
import { TwitterData } from 'src/app/interfaces/covid-data';
import { TwitterDataService } from 'src/app/services/twitter-data.service';

@Component({
  selector: 'app-related-words-graph',
  templateUrl: './related-words-graph.component.html',
  styleUrls: ['./related-words-graph.component.scss']
})
export class RelatedWordsGraphComponent implements OnInit {

  constructor(private twitterService : TwitterDataService) { }

  ngOnInit(): void {
    this.getTwitterData();
  }
  getTwitterData(){
    this.twitterService.getModelResult().subscribe((dt: TwitterData[]) => {
      this.TwitterData = dt;
      this.TwitterData.forEach(element => {
        if(element.key==null){
          element.key="NULL";
        }
       
     });
      this.createGraph();
    });
  }
  barRoot: any;
  twitterData: any[] = [];
  TwitterData: TwitterData[] = [];

  

  createGraph(){
    if(this.barRoot != null)
      this.barRoot.dispose();

    this.barRoot = am5.Root.new("graphdiv");


      // Set themes
      this.barRoot.setThemes([
        am5themes_Animated.new(this.barRoot)
      ]);
      
      
      // Create chart
      let chart = this.barRoot.container.children.push(am5xy.XYChart.new(this.barRoot, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX"
      }));
      
      // Add cursor
      let cursor = chart.set("cursor", am5xy.XYCursor.new(this.barRoot, {}));
      cursor.lineY.set("visible", false);
      
      
      // Create axes
      let xRenderer = am5xy.AxisRendererX.new(this.barRoot, { minGridDistance: 30 });
      xRenderer.labels.template.setAll({
        rotation: -45,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
      });
      
      xRenderer.grid.template.set('opacity', 0);
      
      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(this.barRoot, {
        maxDeviation: 0.3,
        categoryField: "key",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(this.barRoot, {})
      }));

      xAxis.children.push(
        am5.Label.new(this.barRoot, {
          text: "Model Label Result",
          x: am5.p50,
          centerX:am5.p50,
          fontSize: 20,
          fontWeight: '500'
        })
      ); 
      
      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(this.barRoot, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(this.barRoot, {})
      }));

      yAxis.children.unshift(
        am5.Label.new(this.barRoot, {
          rotation: -90,
          text: "Number of Results",
          y: am5.p50,
          centerX: am5.p50,
          fontSize: 20,
          fontWeight: '500'
        })
      );
      
      
      // Create series
      let series = chart.series.push(am5xy.ColumnSeries.new(this.barRoot, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "total",
        sequencedInterpolation: true,
        categoryXField: "key",
        tooltip: am5.Tooltip.new(this.barRoot, {
          labelText:"{valueY}"
        })
      }));
      
      series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
      
      // chart.events.on("beforevalidated", function(event:any) {
      //   // check if there's data
      //   //console.log(event.categoryXField);
      //   if (event.categoryXField==null) {
      //     // handle null data here
          
      //   }
      // });
      xAxis.data.setAll(this.TwitterData.slice(0, 20));
      series.data.setAll(this.TwitterData.slice(0, 20));
      
      
      // Make stuff animate on load
      series.appear(1000);
      chart.appear(1000, 100);
  }

}
