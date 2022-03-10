import { Component, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5/';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/animated';
import { TwitterData } from 'src/app/interfaces/covid-data';
import { TwitterDataService } from 'src/app/services/twitter-data.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  twitterData: any[] = [];
  date: Date = new Date();
  TwitterData: TwitterData[] = [];
  
  barRoot: any;
  
  constructor(private twitterService : TwitterDataService) { }

  ngOnInit(): void {

    this.getdata();
    this.getTwitterData();
    this.date = new Date(this.twitterData[0]['date']);
    this.date.setHours(0, 0, 0, 0);

    this.createChart();
  }

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
        rotation: -90,
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
          text: "Source",
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
          text: "Number of Tweets collected",
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
      
      xAxis.data.setAll(this.TwitterData.slice(0, 20));
      series.data.setAll(this.TwitterData.slice(0, 20));
      
      
      // Make stuff animate on load
      series.appear(1000);
      chart.appear(1000, 100);
  }

  createChart() {
    let root = am5.Root.new("chartdiv");

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Create chart
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX"
    }));

    // Add cursor
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none"
    }));
    cursor.lineY.set("visible", false);
    
    // Create axes
    let xRenderer = am5xy.AxisRendererX.new(root, {
      pan: "zoom"
    });
    xRenderer.grid.template.set('opacity', 0);

    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0.5,
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));

    xAxis.children.push(
      am5.Label.new(root, {
        text: "Date",
        x: am5.p50,
        centerX:am5.p50,
        fontSize: 20,
        fontWeight: '500'
      })
    ); 

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 1,
      renderer: am5xy.AxisRendererY.new(root, {
        pan: "zoom"
      })
    }));

    yAxis.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: "Number of Tweets collected",
        y: am5.p50,
        centerX: am5.p50,
        fontSize: 20,
        fontWeight: '500'
      })
    );


    // Add series
    let series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
      name: "Series",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));

    series.fills.template.setAll({
      visible: true,
      fillOpacity: 0.2
    });

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationY: 0,
        sprite: am5.Circle.new(root, {
          radius: 4,
          stroke: root.interfaceColors.get("background"),
          strokeWidth: 2,
          fill: series.get("fill")
        })
      });
    });

    // Add scrollbar
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));

    let data = this.generateDatas();
    series.data.setAll(data);

    // Make stuff animate on load
    series.appear(1000);
    chart.appear(1000, 100);
  }

  generateData(tweet: { [x: string]: number; }) {
    let value = tweet['value'] ;
    am5.time.add(this.date, "day", 1);
    return {
      date: this.date.getTime(),
      value: value
    };
  }

  generateDatas() {
    let datas: any[] = [];
    this.twitterData.forEach((element: any) => {      
      datas.push(this.generateData(element));
    });
    return datas;
  }

  getTwitterData(){
    this.twitterService.getSource().subscribe((dt: TwitterData[]) => {
      this.TwitterData = dt;
      this.createGraph();
    });
  }

  getdata(): any[]{
    this.twitterData = [{value:2.4,	  date:'1/3/2020'},
    {value:1.2     ,date:'1/4/2020'    },
    {value:1.4     ,date:'1/5/2020'    },
    {value:1.4     ,date:'1/6/2020'    },
    {value:1.4     ,date:'1/7/2020'    },
    {value:1.2     ,date:'1/8/2020'    },
    {value:1.2     ,date:'1/12/2020'   },
    {value:1       ,date:'1/13/2020'   },
    {value:1.4     ,date:'1/14/2020'   },
    {value:1.6     ,date:'1/15/2020'   },
    {value:1.8     ,date:'1/18/2020'   },
    {value:2       ,date:'1/19/2020'   },
    {value:2.8     ,date:'1/20/2020'   },
    {value:2.4     ,date:'1/22/2020'   },
    {value:3.2     ,date:'1/23/2020'   },
    {value:3.2     ,date:'1/25/2020'   },
    {value:3.4     ,date:'1/26/2020'   },
    {value:3.2     ,date:'1/27/2020'   },
    {value:3.8     ,date:'1/28/2020'   },
    {value:3       ,date:'1/30/2020'   },
    {value:3.2     ,date:'1/31/2020'   },
    {value:3.6     ,date:'2/2/2020'    },
    {value:3.2     ,date:'2/3/2020'    },
    {value:3.6     ,date:'2/5/2020'    },
    {value:3.6     ,date:'2/6/2020'    },
    {value:3.2     ,date:'2/7/2020'    },
    {value:2.8     ,date:'2/8/2020'    },
    {value:5       ,date:'2/9/2020'    },
    {value:24.2    ,date:'2/10/2020'   },
    {value:68.6    ,date:'2/11/2020'   },
    {value:92.2    ,date:'2/12/2020'   },
    {value:119     ,date:'2/13/2020'   },
    {value:151.2   ,date:'2/14/2020'   },
    {value:178.2   ,date:'2/15/2020'   },
    {value:195.6   ,date:'2/16/2020'   },
    {value:207     ,date:'2/17/2020'   },
    {value:210     ,date:'2/18/2020'   },
    {value:219.6   ,date:'2/19/2020'   },
    {value:206     ,date:'2/20/2020'   },
    {value:260     ,date:'2/21/2020'   },
    {value:296.2   ,date:'2/22/2020'   },
    {value:366.8   ,date:'2/23/2020'   },
    {value:420     ,date:'2/24/2020'   },
    {value:532.8   ,date:'2/25/2020'   },
    {value:608     ,date:'2/26/2020'   },
    {value:692.4   ,date:'2/27/2020'   },
    {value:730     ,date:'2/28/2020'   },
    {value:960.8   ,date:'2/29/2020'   },
    {value:1046.4  ,date:'3/1/2020'    },
    {value:1164.8  ,date:'3/2/2020'    },
    {value:1435.2  ,date:'3/3/2020'    },
    {value:1754    ,date:'3/4/2020'    },
    {value:1874.6  ,date:'3/5/2020'    },
    {value:2068.2  ,date:'3/6/2020'    },
    {value:2447.6  ,date:'3/7/2020'    },
    {value:2698.8  ,date:'3/8/2020'    },
    {value:3270.2  ,date:'3/9/2020'    },
    {value:5593.2  ,date:'3/10/2020'   },
    {value:7863.4  ,date:'3/11/2020'   },
    {value:8576.4  ,date:'3/12/2020'   },
    {value:9463.4  ,date:'3/13/2020'   },
    {value:10500.8 ,date:'3/14/2020'   },
    {value:9954.4  ,date:'3/15/2020'   },
    {value:9474    ,date:'3/16/2020'   },
    {value:10772.6 ,date:'3/17/2020'   },
    {value:11772.2 ,date:'3/18/2020'   },
    {value:11989.2 ,date:'3/19/2020'   },
    {value:12448   ,date:'3/20/2020'   },
    {value:12958.6 ,date:'3/21/2020'   },
    {value:12932.2 ,date:'3/22/2020'   },
    {value:14051.4 ,date:'3/23/2020'   },
    {value:14481   ,date:'3/24/2020'   },
    {value:15995.4 ,date:'3/25/2020'   },
    {value:16216.2 ,date:'3/26/2020'   },
    {value:16192   ,date:'3/27/2020'   },
    {value:15372.8 ,date:'3/28/2020'   },
    {value:15731.8 ,date:'3/29/2020'   },
    {value:14277.2 ,date:'3/30/2020'   },
    {value:13988   ,date:'3/31/2020'   },
    {value:13778   ,date:'4/1/2020'    },
    {value:12980.2 ,date:'4/2/2020'    },
    {value:12403.2 ,date:'4/3/2020'    },
    {value:12842   ,date:'4/4/2020'    },
    {value:12750.6 ,date:'4/5/2020'    },
    {value:12662.2 ,date:'4/6/2020'    },
    {value:12707.8 ,date:'4/7/2020'    },
    {value:12237.2 ,date:'4/8/2020'    },
    {value:11028.6 ,date:'4/9/2020'    },
    {value:10072   ,date:'4/10/2020'   },
    {value:9795.8  ,date:'4/11/2020'   },
    {value:9802.6  ,date:'4/12/2020'   },
    {value:9726.8  ,date:'4/13/2020'   },
    {value:10041.4 ,date:'4/14/2020'   },
    {value:10602.6 ,date:'4/15/2020'   },
    {value:10561.8 ,date:'4/16/2020'   },
    {value:10021.6 ,date:'4/17/2020'   },
    {value:9917    ,date:'4/18/2020'   },
    {value:9545.6  ,date:'4/19/2020'   },
    {value:9734    ,date:'4/20/2020'   },
    {value:9821    ,date:'4/21/2020'   },
    {value:10004.8 ,date:'4/22/2020'   },
    {value:9631.4  ,date:'4/23/2020'   },
    {value:9280    ,date:'4/24/2020'   },
    {value:8874.2  ,date:'4/25/2020'   },
    {value:8702.4  ,date:'4/26/2020'   },
    {value:8970.2  ,date:'4/27/2020'   },
    {value:9478.8  ,date:'4/28/2020'   },
    {value:9858.6  ,date:'4/29/2020'   },
    {value:9563.4  ,date:'4/30/2020'   },
    {value:9043.8  ,date:'5/1/2020'    },
    {value:8620.6  ,date:'5/2/2020'    },
    {value:8497    ,date:'5/3/2020'    },
    {value:8341.6  ,date:'5/4/2020'    },
    {value:8881    ,date:'5/5/2020'    },
    {value:9780.2  ,date:'5/6/2020'    },
    {value:10600.4 ,date:'5/7/2020'    },
    {value:10528.6 ,date:'5/8/2020'    },
    {value:10779.8 ,date:'5/9/2020'    },
    {value:10346.2 ,date:'5/10/2020'   },
    {value:9629.4  ,date:'5/11/2020'   },
    {value:8897.2  ,date:'5/12/2020'   },
    {value:8767.4  ,date:'5/13/2020'   },
    {value:8153.8  ,date:'5/14/2020'   },
    {value:7818.6  ,date:'5/15/2020'   },
    {value:8154.6  ,date:'5/16/2020'   },
    {value:8495.8  ,date:'5/17/2020'   },
    {value:8645    ,date:'5/18/2020'   },
    {value:8986.4  ,date:'5/19/2020'   },
    {value:9189    ,date:'5/20/2020'   },
    {value:8712.6  ,date:'5/21/2020'   },
    {value:8211.8  ,date:'5/22/2020'   },
    {value:7883.4  ,date:'5/23/2020'   },
    {value:7718.4  ,date:'5/24/2020'   },
    {value:7650.2  ,date:'5/25/2020'   },
    {value:8131.6  ,date:'5/26/2020'   },
    {value:8221.8  ,date:'5/27/2020'   },
    {value:8160.6  ,date:'5/28/2020'   },
    {value:7645    ,date:'5/29/2020'   },
    {value:7267.8  ,date:'5/30/2020'   },
    {value:6509.8  ,date:'5/31/2020'   },
    {value:6326    ,date:'6/1/2020'    },
    {value:6719    ,date:'6/2/2020'    },
    {value:6891.6  ,date:'6/3/2020'    },
    {value:6702.6  ,date:'6/4/2020'    },
    {value:6468.8  ,date:'6/5/2020'    },
    {value:6457.8  ,date:'6/6/2020'    },
    {value:6095.4  ,date:'6/7/2020'    },
    {value:6262.4  ,date:'6/8/2020'    },
    {value:6682    ,date:'6/9/2020'    },
    {value:7016.2  ,date:'6/10/2020'   },
    {value:7184.8  ,date:'6/11/2020'   },
    {value:6812.6  ,date:'6/12/2020'   },
    {value:7136.8  ,date:'6/13/2020'   },
    {value:7461    ,date:'6/14/2020'   },
    {value:7935.2  ,date:'6/15/2020'   },
    {value:8090.6  ,date:'6/16/2020'   },
    {value:8949.4  ,date:'6/17/2020'   },
    {value:10049   ,date:'6/18/2020'   },
    {value:10173.2 ,date:'6/19/2020'   },
    {value:10840.4 ,date:'6/20/2020'   },
    {value:12104.4 ,date:'6/21/2020'   },
    {value:12659   ,date:'6/22/2020'   },
    {value:12226.4 ,date:'6/23/2020'   },
    {value:12834   ,date:'6/24/2020'   },
    {value:12276.2 ,date:'6/25/2020'   },
    {value:10667   ,date:'6/26/2020'   },
    {value:10097.6 ,date:'6/27/2020'   },
    {value:10096.6 ,date:'6/28/2020'   },
    {value:10058.8 ,date:'6/29/2020'   },
    {value:10680.6 ,date:'6/30/2020'   },
    {value:11636   ,date:'7/1/2020'    },
    {value:12706.6 ,date:'7/2/2020'    },
    {value:11979.6 ,date:'7/3/2020'    },
    {value:12063.4 ,date:'7/4/2020'    },
    {value:13195.2 ,date:'7/5/2020'    },
    {value:13404   ,date:'7/6/2020'    },
    {value:12657.4 ,date:'7/7/2020'    },
    {value:13336   ,date:'7/8/2020'    },
    {value:13995   ,date:'7/9/2020'    },
    {value:13453.2 ,date:'7/10/2020'   },
    {value:13811.4 ,date:'7/11/2020'   },
    {value:14401.2 ,date:'7/12/2020'   },
    {value:15258.4 ,date:'7/13/2020'   },
    {value:15015.6 ,date:'7/14/2020'   },
    {value:14924.6 ,date:'7/15/2020'   },
    {value:14048.8 ,date:'7/16/2020'   },
    {value:13191   ,date:'7/17/2020'   },
    {value:12671.2 ,date:'7/18/2020'   },
    {value:11996.2 ,date:'7/19/2020'   },
    {value:11166.4 ,date:'7/20/2020'   },
    {value:11339   ,date:'7/21/2020'   },
    {value:11285.6 ,date:'7/22/2020'   },
    {value:10209.4 ,date:'7/23/2020'   },
    {value:9262.4  ,date:'7/24/2020'   },
    {value:10411.2 ,date:'7/25/2020'   },
    {value:10526.2 ,date:'7/26/2020'   },
    {value:11326   ,date:'7/27/2020'   },
    {value:12476.4 ,date:'7/28/2020'   },
    {value:13602.6 ,date:'7/29/2020'   },
    {value:12156.6 ,date:'7/30/2020'   },
    {value:12166.2 ,date:'7/31/2020'   },
    {value:12017.6 ,date:'8/1/2020'    },
    {value:11418.4 ,date:'8/2/2020'    },
    {value:10760.6 ,date:'8/3/2020'    },
    {value:11358.6 ,date:'8/4/2020'    },
    {value:11085.6 ,date:'8/5/2020'    },
    {value:9929.2  ,date:'8/6/2020'    },
    {value:9276.2  ,date:'8/7/2020'    },
    {value:9897    ,date:'8/8/2020'    },
    {value:9377    ,date:'8/9/2020'    },
    {value:9046.8  ,date:'8/10/2020'   },
    {value:9443    ,date:'8/11/2020'   },
    {value:9579.6  ,date:'8/12/2020'   },
    {value:8499.4  ,date:'8/13/2020'   },
    {value:7749.6  ,date:'8/14/2020'   },
    {value:7603.8  ,date:'8/15/2020'   },
    {value:7499    ,date:'8/16/2020'   },
    {value:7409.2  ,date:'8/17/2020'   },
    {value:7936    ,date:'8/18/2020'   },
    {value:8410.4  ,date:'8/19/2020'   },
    {value:8086.2  ,date:'8/20/2020'   },
    {value:7805    ,date:'8/21/2020'   },
    {value:8160.2  ,date:'8/22/2020'   },
    {value:8167    ,date:'8/23/2020'   },
    {value:8144.4  ,date:'8/24/2020'   },
    {value:8810.8  ,date:'8/25/2020'   },
    {value:9398.6  ,date:'8/26/2020'   },
    {value:9039.6  ,date:'8/27/2020'   },
    {value:8662.8  ,date:'8/28/2020'   },
    {value:8685.8  ,date:'8/29/2020'   },
    {value:8289.2  ,date:'8/30/2020'   },
    {value:7977.4  ,date:'8/31/2020'   },
    {value:9750.6  ,date:'9/1/2020'    },
    {value:10305.4 ,date:'9/2/2020'    },
    {value:9801.8  ,date:'9/3/2020'    },
    {value:9550.4  ,date:'9/4/2020'    },
    {value:9349.4  ,date:'9/5/2020'    },
    {value:7607    ,date:'9/6/2020'    },
    {value:7161.2  ,date:'9/7/2020'    },
    {value:7721    ,date:'9/8/2020'    },
    {value:7929.4  ,date:'9/9/2020'    },
    {value:7696    ,date:'9/10/2020'   },
    {value:7100.8  ,date:'9/11/2020'   },
    {value:7183.8  ,date:'9/12/2020'   },
    {value:6953.6  ,date:'9/13/2020'   },
    {value:7335    ,date:'9/14/2020'   },
    {value:7975.6  ,date:'9/15/2020'   },
    {value:8659    ,date:'9/16/2020'   },
    {value:8152.8  ,date:'9/17/2020'   },
    {value:7614.8  ,date:'9/18/2020'   },
    {value:7345.8  ,date:'9/19/2020'   },
    {value:7256.2  ,date:'9/20/2020'   },
    {value:7465    ,date:'9/21/2020'   },
    {value:8661.2  ,date:'9/22/2020'   },
    {value:9307.4  ,date:'9/23/2020'   },
    {value:8832.2  ,date:'9/24/2020'   },
    {value:8065    ,date:'9/25/2020'   },
    {value:7466.2  ,date:'9/26/2020'   },
    {value:7202    ,date:'9/27/2020'   },
    {value:7240.6  ,date:'9/28/2020'   },
    {value:7958.6  ,date:'9/29/2020'   },
    {value:11909.8 ,date:'9/30/2020'   },
    {value:15827.2 ,date:'10/1/2020'   },
    {value:18418.2 ,date:'10/2/2020'   },
    {value:23711.4 ,date:'10/3/2020'   },
    {value:27375.2 ,date:'10/4/2020'   },
    {value:26820.2 ,date:'10/5/2020'   },
    {value:25578.8 ,date:'10/6/2020'   },
    {value:24092.4 ,date:'10/7/2020'   },
    {value:19663   ,date:'10/8/2020'   },
    {value:16166.2 ,date:'10/9/2020'   },
    {value:14263.4 ,date:'10/10/2020'  },
    {value:13177.2 ,date:'10/11/2020'  },
    {value:13017.8 ,date:'10/12/2020'  },
    {value:13427.6 ,date:'10/13/2020'  },
    {value:13566.2 ,date:'10/14/2020'  },
    {value:12570.2 ,date:'10/15/2020'  },
    {value:10991   ,date:'10/16/2020'  },
    {value:9450.8  ,date:'10/17/2020'  },
    {value:8055    ,date:'10/18/2020'  },
    {value:7572.8  ,date:'10/19/2020'  },
    {value:7713.2  ,date:'10/20/2020'  },
    {value:7873.8  ,date:'10/21/2020'  },
    {value:7658    ,date:'10/22/2020'  },
    {value:8393.2  ,date:'10/23/2020'  },
    {value:8658.8  ,date:'10/24/2020'  },
    {value:8788.6  ,date:'10/25/2020'  },
    {value:11391.8 ,date:'10/26/2020'  },
    {value:12295.6 ,date:'10/27/2020'  },
    {value:12235.8 ,date:'10/28/2020'  },
    {value:11822   ,date:'10/29/2020'  },
    {value:11241.8 ,date:'10/30/2020'  },
    {value:9131.4  ,date:'10/31/2020'  },
    {value:8709.2  ,date:'11/1/2020'   },
    {value:7967.8  ,date:'11/2/2020'   },
    {value:8209.4  ,date:'11/3/2020'   },
    {value:8647.2  ,date:'11/4/2020'   },
    {value:9127.4  ,date:'11/5/2020'   },
    {value:8607.6  ,date:'11/6/2020'   },
    {value:9921.6  ,date:'11/7/2020'   },
    {value:10096.2 ,date:'11/8/2020'   },
    {value:10349.6 ,date:'11/9/2020'   },
    {value:10465.4 ,date:'11/10/2020'  },
    {value:12554.4 ,date:'11/11/2020'  },
    {value:11782.4 ,date:'11/12/2020'  },
    {value:11631.2 ,date:'11/13/2020'  },
    {value:12024   ,date:'11/14/2020'  },
    {value:11787.2 ,date:'11/15/2020'  },
    {value:10893.4 ,date:'11/16/2020'  },
    {value:11123.2 ,date:'11/17/2020'  },
    {value:12317.2 ,date:'11/18/2020'  },
    {value:12608.6 ,date:'11/19/2020'  },
    {value:12021.6 ,date:'11/20/2020'  },
    {value:11770.2 ,date:'11/21/2020'  },
    {value:11474.2 ,date:'11/22/2020'  },
    {value:10636.8 ,date:'11/23/2020'  },
    {value:9832    ,date:'11/24/2020'  },
    {value:9699.4  ,date:'11/25/2020'  },
    {value:8863.4  ,date:'11/26/2020'  },
    {value:8336    ,date:'11/27/2020'  },
    {value:8074    ,date:'11/28/2020'  },
    {value:8368.6  ,date:'11/29/2020'  },
    {value:8509.6  ,date:'11/30/2020'  },
    {value:8954.8  ,date:'12/1/2020'   },
    {value:9205    ,date:'12/2/2020'   },
    {value:8782.8  ,date:'12/3/2020'   },
    {value:9029    ,date:'12/4/2020'   },
    {value:9748.6  ,date:'12/5/2020'   },
    {value:9870.2  ,date:'12/6/2020'   },
    {value:10608.8 ,date:'12/7/2020'   },
    {value:11098.4 ,date:'12/8/2020'   },
    {value:10581   ,date:'12/9/2020'   },
    {value:9676.2  ,date:'12/10/2020'  },
    {value:9278.2  ,date:'12/11/2020'  },
    {value:8598.4  ,date:'12/12/2020'  },
    {value:8394.6  ,date:'12/13/2020'  },
    {value:8215.6  ,date:'12/14/2020'  },
    {value:9324    ,date:'12/15/2020'  },
    {value:9770.8  ,date:'12/16/2020'  },
    {value:9448.2  ,date:'12/17/2020'  },
    {value:8960.6  ,date:'12/18/2020'  },
    {value:8765.2  ,date:'12/19/2020'  },
    {value:7811    ,date:'12/20/2020'  },
    {value:7417.6  ,date:'12/21/2020'  },
    {value:7383.4  ,date:'12/22/2020'  },
    {value:7122.6  ,date:'12/23/2020'  },
    {value:6648.4  ,date:'12/24/2020'  },
    {value:6049.2  ,date:'12/25/2020'  },
    {value:6120.8  ,date:'12/26/2020'  },
    {value:6698    ,date:'12/27/2020'  },
    {value:8249.4  ,date:'12/28/2020'  },
    {value:9471.4  ,date:'12/29/2020'  }];

    return this.twitterData;
  }

}
