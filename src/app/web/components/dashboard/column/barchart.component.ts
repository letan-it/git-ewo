import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { AnyAaaaRecord } from 'dns';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss']
})
export class BarchartComponent implements OnChanges {
  @Input() barChart: any
  @Output() isShowDt = new EventEmitter<any>();
  updateFlag: boolean = false;
  column!: any;
  bar!: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['barChart']) {
      const barchart = this.barChart
      this.updateChart(barchart)
    }
  }
  Highcharts: typeof Highcharts = Highcharts;
  Options_bar: Highcharts.Options = {}

  updateChart(e: any) {
    const data = e?.map((i: any) => ({
      column: i.column,
      bar: i.bar
    }))


    if (data && data?.length > 0) {
      this.column = data[0].column
      this.bar = data[0].bar
    }

    this.Options_bar.title = {
      text: ''
    },
      this.Options_bar.exporting = {
        enabled: false
      },
      this.Options_bar.legend = {
        enabled: false,
        layout: 'horizontal',
        verticalAlign: 'top',
        itemStyle: {
          fontSize: '12px',
          fontWeight: '500',
        },
        squareSymbol: false,
        symbolPadding: 4,
        symbolWidth: 40,
        // symbolHeight: 10,
        symbolRadius: 0,
        // maxHeight: 50,
        alignColumns: false,

      },

      this.Options_bar.xAxis = {
        categories: this.column,
        tickColor: "red",
        crosshair: {
          width: 80
        },
        // lineColor:'red',
        labels: {
          style: {

            fontSize: '14px',
            fontWeight: '500',
          }
        },
        lineWidth: 0


      },
      this.Options_bar.yAxis = {
        categories: undefined,
        title: {
          text: null
        },

        labels: {
          style: {
            fontSize: '14px',
            fontWeight: '500',

          }
        },
        gridLineWidth: 0,
        showFirstLabel: false,
      },


      this.Options_bar.series = [
        {
          name: 'Report',
          data: this.bar,
          type: 'column'
        },

      ],
      this.Options_bar.tooltip = {
        shared: true,
        padding: 2,
        style: {
          fontSize: '12px',
          cursor: 'pointer',
          fontWeight: '600',
        }
      },
      this.Options_bar.credits = {
        enabled: false,
      };
    this.Options_bar.plotOptions = {
      column: {
        dataLabels: {
          enabled: true,

          style: {
            enabled: true,
            y: -20,
            verticalAlign: 'top',
            fontSize: '14px',
            fontWeight: '500',
            format: '{point.label}'
          }
        },
        cursor: 'pointer',
        selected: true,
        allowPointSelect: true,
        pointWidth: 50,
        events: {
          click: (e) => {
            this.isShowDt.emit(e?.point?.category)
          },
        }

      }
    }

    this.updateFlag = true
  }



}
