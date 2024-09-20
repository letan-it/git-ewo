import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Helper } from 'src/app/Core/_helper';

// Services
import { ReportsService } from 'src/app/web/service/reports.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { Message, MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';

@Component({
    selector: 'app-log-file',
    templateUrl: './works-status.component.html',
    providers: []
})
export class WorksStatusComponent implements OnInit {

    constructor(
        private _service: ReportsService
    ) { }

    items_menu: any = [
        { label: ' REPORT' },
        {
            label: ' Works Status',
            icon: 'pi pi-table',
        },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    // menu_id = 62;
    // check_permissions() {
    //     const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
    //         (item: any) => item.menu_id == this.menu_id && item.check == 1
    //     );
    //     if (menu.length > 0) {
    //     } else {
    //         this.router.navigate(['/empty']);
    //     }
    // }

    // selectedReportStatusType: any;
    
    // reportStatusName: any = [
        //     { name: 'Thành công' }, 
        //     { name: 'Không Thành Công' }
        // ];
        // selectedReportStatusName: any;

    statusType: any = '';
    reportStatusType: any = [{ name: 'TC' }, { name: 'KTC' }];

    statusName: any = '';
    reportStatusName: any = [
        { name: 'Thành công' }, 
        { name: 'Không Thành Công' }
    ];
    status: any = -1;
    statuses: any = [
        { name: 'Any', value: -1 },
        { name: 'Inactive', value: 0 },
        { name: 'Active', value: 1 }
    ];

    reportStatusDesc: any = "";

    selectedReportStatusType(e: any) {
        console.log(e)
        this.statusType = e.value.name === null ? "" : e.value.name;
    }
    selectedReportStatusName(e: any) {
        console.log(e)
        this.statusName = e.value.name === null ? "" : e.value.name;
    }
    selectedStatus(e: any) {
        console.log(e)
        this.status = e.value.value === null ? -1 : e.value.value;
    }

    clearType(e: any) {
        this.statusType = "";
    }
    clearName(e: any) {
        this.statusName = "";
    }
    clearStatus(e: any) {
        this.status = -1;
    }

    date: any = null;
    created_date_int: any = null;

    getDate() {
        let today = new Date();
        this.date = new Date(today);
        this.setDate(this.date);
    }

    changeDate(event: any) {
        // console.log(event);
    }

    setDate(date: any) {
        if (Helper.IsNull(date) != true) {
            this.created_date_int = Helper.convertDate(new Date(date))
            this.created_date_int = Helper.transformDateInt(new Date(this.created_date_int))
        } else {
            this.created_date_int = null;
        }
    }

    ngOnInit() {
        // this.check_permissions();
        // this.getDate();

        // this.loadData(1);
    }

    is_loadForm: number = 0;
    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;
        this.loadData(this._pageNumber);
    }

    isLoading_Filter: any = false;
    listReportStatus: any = [];

    loadData(pageNumber: number) {
        this.is_loadForm = 1;
        if (pageNumber == 1) {
          this.first = 0;
          this.totalRecords = 0;
          this._pageNumber = 1;
        }
        // this.setDate(this.date);
        this.listReportStatus = [];
        // this.isLoading_Filter = true;
        console.log(this.statusType);
        console.log(this.statusName);
        console.log(this.reportStatusDesc);
        console.log(this.status);

        this._service.ewo_Report_Status_GetList(
            Helper.ProjectID(), 
            this.statusType, 
            this.statusName,
            this.reportStatusDesc,
            this.status
        ).subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listReportStatus = data.data;
                    // console.log(this.listReportStatus)
                    this.totalRecords = Helper.IsNull(this.listReportStatus) != true ? this.listReportStatus[0].TotalRows : 0;
                    // this.isLoading_Filter = false;
                } else {
                    this.listReportStatus = [];
                    // this.isLoading_Filter = false;
                }
            }
        )
    }

    handleFilter() {
        this.loadData(1);
    }

    showFilter: number = 1;
    ShowHideFilter() {
        if (this.showFilter == 1) {
            this.showFilter = 0;
        } else {
            this.showFilter = 1;
        }
    }
} 