import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { EnumStatus } from 'src/app/Core/_enum';

import { MonitorService } from '../../service/monitor.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
Chart.register(ChartDataLabels);

@Component({
    selector: 'app-dashboard-monitor',
    templateUrl: './dashboard-monitor.component.html',
    styleUrls: ['./dashboard-monitor.component.scss'],
})
export class DashboardMonitorComponent implements OnInit, OnDestroy {
    constructor(private _service: MonitorService) {}
    flag: boolean = true;
    value: number = 600; // Initialize countdown value to 10
  private intervalId: any;
    ngOnInit(): void {
        this.refresh()
        this.startCountdown();
    }

    startCountdown(): void {
        this.intervalId = setInterval(() => {
          if (this.value > 0) {
            this.value--; // Decrease the value by 1 every second
          } else {
            this.listData = [];
            this.loadData(); // Call loadData() when countdown reaches 0
            this.value = 600; // Reset countdown value to 10
          }
        }, 1000); // 1000 ms = 1 second
      }
    refresh() {
        this.listData = [];
        this.loadData();
    }
    subscription!: Subscription;
    dem: any[] = [];

    listData: any[] = [];
    listApi: any[] = [
        { Audit: environment.apiUrl },
        { Attendance: environment.api_EWO_Attendance },
        { Survey: environment.api_EWO_Survey },
        { File: environment.api_file },
        { POSM: environment.api_EWO_POSM },
        { OSA: environment.api_EWO_OSA },
        { DISPLAY: environment.api_EWO_DISPLAY },
        { WORKFOLLOW: environment.api_EWO_WORKFOLLOW },
        { WAREHOUSE: environment.api_EWO_WAREHOUSE },
        { SELL: environment.api_EWO_SELL },
        { OOL: environment.api_EWO_OOL },
        { ACTIVATION: environment.api_EWO_Activation },
        { LOGISTICS: environment.api_EWO_Logistics },
        { INVENTORY: environment.api_EWO_Inventory },
        { SOS: environment.api_EWO_SOS },
        { FIELDCOACHING: environment.api_EWO_FIELDCOACHING },
    ];

    loadData() {
        if (this.flag == true) {
            this.flag = false;
            this.dem = Array(this.listApi.length).fill(0);

            this.listApi.forEach((item) => {
                for (let key in item) {
                    this.subscription = this._service
                        .GetMonitor(item[key] + 'Monitor/')
                        .subscribe(
                            (data: any) => {
                                if (data.result == EnumStatus.ok) {
                                    data.data.name = key;
                                    data.data.ram.total =
                                        data.data.ram.total /
                                        1024 /
                                        1024 /
                                        1000;
                                    data.data.cpu.total =
                                        data.data.cpu.total / 1000;
                                    if (data.data.cpu.cpuUsage > 100) {
                                        data.data.classCPU = `progress-100`;
                                        data.data.classRAM = `progress-${data.data.ram.memoryUsage.toFixed()}`;
                                    } else {
                                        data.data.classCPU = `progress-${data.data.cpu.cpuUsage.toFixed()}`;
                                        data.data.classRAM = `progress-${data.data.ram.memoryUsage.toFixed()}`;
                                    }
                                    this.dem.pop();
                                    this.flag =
                                        this.dem.length == 0 ? true : false;
                                    this.listData.push(data.data);
                                }
                            },
                            (err: any) => {
                                var error = {
                                    cpu: {
                                        cpuUsage: null,
                                        used: null,
                                        total: null,
                                    },
                                    ram: {
                                        memoryUsage: null,
                                        used: null,
                                        total: null,
                                    },
                                    name: key,
                                    classCPU: 'progress-null',
                                    classRAM: 'progress-null',
                                };
                                this.dem.pop();
                                this.flag = this.dem.length == 0 ? true : false;
                                this.listData.push(error);
                            }
                        );
                }
            });
        }
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
