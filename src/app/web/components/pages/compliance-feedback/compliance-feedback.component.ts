import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EnumStatus } from 'src/app/Core/_enum';
import { ExportService } from 'src/app/web/service/export.service';
import { ReportsService } from 'src/app/web/service/reports.service';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
@Component({
    selector: 'app-compliance-feedback',
    templateUrl: './compliance-feedback.component.html',
    styleUrls: ['./compliance-feedback.component.scss'],
})
export class ComplianceFeedbackComponent {
    constructor(
        private router: Router,
        private _service: ReportsService,
        private serviceExport: ExportService
    ) { }
    showFiter: number = 1;

    ShowHideFiter() {
        if (this.showFiter == 1) {
            this.showFiter = 0;
        } else {
            this.showFiter = 1;
        }
    }
    ngOnInit(): void {
        let newDate = new Date();
        this.getMonth(newDate, 'MM');
        this.filter();
    }
    isLoading_Filter: any = false;
    export() {
        this.serviceExport.ASO_Report_SummaryQC(
            Helper.ProjectID(),
            this.selectMonth.code,
            this.is_test
        );
    }
    dataArea: any;
    dataShop: any;
    filter() {
        this.isLoading_Filter = true;
        this._service
            .ASO_Report_SummaryQC(
                Helper.ProjectID(),
                this.selectMonth.code,
                this.is_test
            )
            .subscribe((data: any) => {
                this.isLoading_Filter = false;
                if (data.result == EnumStatus.ok) {
                    this.dataArea = data.data.result;
                    this.dataShop = data.data.detail;
                }
            });
    }
    ListMonth: any = [];
    selectMonth: any;
    is_test: number = -1; //string[] = [];
    getMonth(date: Date, format: string) {
        // const year = 2023;
        // const datePipe = new DatePipe('en-US');
        // let monthNow = parseInt(datePipe.transform(date, format) as any) || 0;
        // if (monthNow < 12) {
        //     monthNow++;
        // } 
        // const monthString = monthToday.toString().padStart(2, '0');
        // if (Helper.IsNull(this.selectMonth) == true) {
        //     this.selectMonth = {
        //         name: `${year} - Tháng ${monthToday}`,
        //         code: parseInt(year + monthString),
        //         month: monthToday,
        //     };
        // }

        const today = new Date();
        const yearCurrent = today.getFullYear();
        const monthToday = today.getMonth() + 1;
        const day = today.getDate()
        // const today = Pf.DateToInt(today) 


        const dataMonth = Helper.getMonth()
        this.ListMonth = dataMonth.ListMonth

        const monthString = monthToday.toString().padStart(2, '0')
        const currentDate = parseInt(yearCurrent + monthString)
        if (Helper.IsNull(this.selectMonth) == true) {
            this.selectMonth = this.ListMonth?.find((i: any) => (i?.code == currentDate))
        }


        // this.month = year + monthString;
    }
}
