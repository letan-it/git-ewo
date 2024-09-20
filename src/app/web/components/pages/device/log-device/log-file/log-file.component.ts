import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Helper } from 'src/app/Core/_helper';

// Services
import { LogsService } from 'src/app/web/service/logs.service';
import { EnumStatus } from 'src/app/Core/_enum';

@Component({
    selector: 'app-log-file',
    templateUrl: './log-file.component.html',
    styleUrls: ['../log-device.component.scss'],
    providers: []
})
export class LogFileComponent {

    constructor(
        private _service: LogsService,
        private router: Router,
        private http: HttpClient
    ) { }

    items_menu: any = [
        { label: ' MASTER' },
        { label: ' Log File ', icon: 'pi pi-calculator' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    menu_id = 87;
    check_permissions() {
      const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
        (item: any) => item.menu_id == this.menu_id && item.check == 1
      );
      if (menu.length > 0) {
      } else {
        this.router.navigate(['/empty']);
      }
    }

    login_name: any = null;
    employee_code: any = null;

    currentDate: any = null;
    listMonth: any = [];
    year_month: any = null;
    date: any = null;
    created_date_int: any = null;
    orders: any = null
    getMonth() {
        const date = new Date()
        const year = date.getFullYear();
        const monthToday = date.getMonth() + 1;
        const monthString = monthToday.toString().padStart(2, '0');
        this.currentDate = parseInt(year + monthString)

        for (let i = 1; i <= 12; i++) {
            const dataMonth = Helper.getMonth()
            this.listMonth = dataMonth.ListMonth
        }
        this.year_month = this.listMonth?.find((i: any) => (i?.code == this.currentDate))
    }
    getDate() {
        let today = new Date();
        this.date = new Date(today);
        this.setDate(this.date);
    }
    changeDate(event: any) {
        console.log(event);
    }
    setDate(date: any) {
        if (Helper.IsNull(date) != true) {
            this.created_date_int = Helper.convertDate(new Date(date))
            this.created_date_int = Helper.transformDateInt(new Date(this.created_date_int))
        } else {
            this.created_date_int = null;
        }
    }

    cols: any = [];
    selectedColumns: any = [];

    ngOnInit(): void {
        this.check_permissions();
        this.getMonth();
        this.loadData(1);
    }

    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;
  
    onPageChange(event: any) {
        console.log(event);
        this.first = event.first;
        this.rows = event.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;
        this.loadData(this._pageNumber);
    }

    isLoading_Filter: any = false;
    listLogFile: any = [];

    loadData(pageNumber: number) {
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }
        this.setDate(this.date);
        this.isLoading_Filter = true;

        this._service.ewo_LogFiles_GetList(Helper.ProjectID(), this.employee_code, Helper.IsNull(this.year_month) != true ? this.year_month.code : 0,
            this.created_date_int, this.rows, pageNumber)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listLogFile = data.data
                    this.listLogFile = this.listLogFile.map((item: any) => ({
                        ...item,
                        _employee_code: `${item.created_by}`,
                        _year_month: Helper.transformYearMonth(item.year_month + ''),
                    }));
                    this.totalRecords = Helper.IsNull(this.listLogFile) != true ? this.listLogFile[0].TotalRows : 0;
                    this.isLoading_Filter = false;
                } else {
                    this.listLogFile = [];
                    this.isLoading_Filter = false;
                }
            }
        )
    }

    export() {
        this._service.ewo_LogFiles_RawData(Helper.ProjectID(), this.employee_code,
            Helper.IsNull(this.year_month) != true ? this.year_month.code : 0, this.created_date_int, 1000000000, 1)
    }

    showFilter: number = 1;
    ShowHideFilter() {
        if (this.showFilter == 1) {
            this.showFilter = 0;
        } else {
            this.showFilter = 1;
        }
    }
    DownloadFile(url: string) {
        this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
            const downloadLink = document.createElement('a'); 
            const fileUrl = window.URL.createObjectURL(blob); 
            downloadLink.href = fileUrl; 
            downloadLink.download = `${url}`; 
            document.body.appendChild(downloadLink); 
            downloadLink.click(); 
            window.URL.revokeObjectURL(fileUrl); 
            document.body.removeChild(downloadLink);
        })
    }
} 
