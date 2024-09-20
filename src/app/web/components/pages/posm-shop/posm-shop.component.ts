import { Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/web/models/product';
import { PosmService } from 'src/app/web/service/posm.service';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import * as FileSaver from 'file-saver';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-posm-shop',
    templateUrl: './posm-shop.component.html',
    styleUrls: ['./posm-shop.component.scss'],
})
export class PosmShopComponent {
    menu_id = 8;
    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );

        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }
    items_menu: any = [
        { label: ' SETTING KPI' },
        { label: ' Shop POSM', icon: 'pi pi-briefcase' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    constructor(
        private messageService: MessageService,
        private router: Router,
        private _service: PosmService
    ) { }

    products!: Product[];
    shop_code: any = '';

    item_Posm: any = 0;
    selectPOSM(event: any) {
        this.item_Posm = event != null ? event.id : 0;
    }
    visible: boolean = false;
    value_target: number = 0;
    Update() {
        console.log(this.value_target);
        console.log(this.item_Posm);
        console.log(this.selectMonth);
        if (Helper.IsNull(this.selectMonth) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please choose year month',
            });
            return;
        }
        console.log(this.shop_code);
        if (this.item_Posm == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please choose item posm',
            });
            return;
        }
        if (this.shop_code == '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter item shop code',
            });
            return;
        }


        if (this.value_target < 0 || this.value_target == undefined || this.value_target == null || this.value_target + '' == '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a Value >= 0',
            });
            return;
        }

        this._service.POSM_Shop_Action(this.selectMonth.code, this.item_Posm, this.shop_code, Helper.ProjectID(), this.value_target).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                this.visible = false
                this.shop_code = ''
                this.value_target = 0
                this.filter(1)
            }
        })




    }
    showDialog() {
        this.visible = true;
    }
    showFiter: number = 1;
    ShowHideFiter() {
        if (this.showFiter == 1) {
            this.showFiter = 0;
        } else {
            this.showFiter = 1;
        }
    }
    selectMonth: any;
    ListMonth: any = [];
    getMonth(date: Date, format: string) {
        const today = new Date();
        const year = today.getFullYear();
        const monthToday = today.getMonth() + 1;
        const datePipe = new DatePipe('en-US');
        let monthNow = parseInt(datePipe.transform(date, format) as any) || 0;
        if (monthNow < 12) {
            monthNow++;
        }
        const dataMonth = Helper.getMonth()
        this.ListMonth = dataMonth.ListMonth

        const monthString = monthToday.toString().padStart(2, '0')
        const currentDate = parseInt(year + monthString)
        if (Helper.IsNull(this.selectMonth) == true) {
            this.selectMonth = this.ListMonth?.find((i: any) => (i?.code == currentDate))
        }
        this.month = year + monthString;

        // for (let month = 1; month <= 12; month++) { 
        //     const yearMonth = `${year} - Tháng ${monthString}`;
        //     if (month == monthNow - 1) {
        //         this.selectMonth = {
        //             name: yearMonth,
        //             code: `${year}${monthString}`,
        //         };
        //     }
        // } 


    }

    PlanDate: any;
    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }

    items: any;

    cols!: Column[];
    exportColumns!: ExportColumn[];

    ngOnInit(): void {
        this.cols = [
            // { field: 'code', header: 'Code', customExportHeader: 'Product Code' }, 
            { field: 'error_name', header: 'Error Name', customExportHeader: 'Error Name' },
            { field: 'shop_code', header: 'Shop Code' },
        ];
        this.exportColumns = this.cols.map((col: any) => ({ title: col.header, dataKey: col.field }));


        this.check_permissions();
        this.items = [
            {
                label: 'Posm',
                icon: 'pi pi-briefcase',
                command: () => {
                    this.viewPosm();
                },
            },
            { separator: true },
            {
                label: 'Reason',
                icon: 'pi pi-question-circle',
                command: () => {
                    this.viewReason();
                },
            },
        ];

        let newDate = new Date();
        this.PlanDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.getMonth(newDate, 'MM');
    }

    isLoading_Filter: any = false;
    ListPosmShop: any = [];
    // {
    //     "rowPerPage": 20,
    //     "pageNumber": 1,
    //     "project_id": 2,
    //     "year_month": "202307",
    //     "posm_id": 0
    // }

    month: any = '';
    filter(pageNumber: number) {
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            // this.rows  = 20;
            this._pageNumber = 1;
        }

        this.ListPosmShop = [];
        this.isLoading_Filter = true;

        this._service
            .POSMShop_GetList(
                this.rows,
                pageNumber,
                Helper.ProjectID(),
                Helper.IsNull(this.selectMonth) == true ? this.month : this.selectMonth.code,
                this.item_Posm,
                this.shop_code
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.ListPosmShop = data.data;
                        this.totalRecords = this.ListPosmShop[0].TotalRows;

                        this.isLoading_Filter = false;
                    } else {
                        this.isLoading_Filter = false;
                        // this.message = 'No data';
                        // this.display = true;
                    }
                }
            });
    }

    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;
    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;

        this._pageNumber = (this.first + this.rows) / this.rows;

        this.filter(this._pageNumber);
    }

    update(posm: any) { }
    showTemplate: number = 0;
    ShowHideTemplate() {
        if (this.showTemplate == 1) {
            this.showTemplate = 0;
        } else {
            this.showTemplate = 1;
        }
    }

    fileTemplete!: any;

    // On file Select
    onChangeFile(event: any) {
        this.dataError = undefined;
        this.dataMessError = undefined;
        this.fileTemplete = event.target.files[0];
    }

    @ViewChild('myInput') myInput: any;

    clearFileInput() {
        this.dataError = undefined;
        this.dataMessError = undefined;
        this.myInput.nativeElement.value = null;
        this.fileTemplete = undefined;
    }

    dataError: any;
    dataMessError: any;
    importTemplate() {
        if (this.fileTemplete == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a file',
            });

            return;
        }

        if (Helper.IsNull(this.selectMonth) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a month',
            });
            return;
        }
        // return
        const formDataUpload = new FormData();
        formDataUpload.append('files', this.fileTemplete);
        formDataUpload.append('year_month', this.selectMonth.code);

        this._service
            .POSMShop_ImportData(formDataUpload, Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    // {
                    //     "result": "ERROR",
                    //     "message": "Error Wrong model, please choose the right model",
                    //     "data": null
                    // }

                    if (data.data.result_ewo_type_POSMSHOP.length > 0) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Successful POSM registration',
                        });

                        // let newDate = new Date();
                        // this.PlanDate = this.getFormatedDate(
                        //     newDate,
                        //     'YYYY-MM-dd'
                        // );
                        // this.getMonth(newDate, 'MM');
                        this.clearFileInput();
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error POSM registration',
                        });
                    }
                } else {
                    if (data.data == null) {
                        this.dataMessError = data.message;
                    } else {
                        this.dataError = data.data;
                    }
                }
            });
    }

    exportTemplate() {
        this._service.POSMShop_GetTemplate(Helper.ProjectID());
    }

    viewPosm() {
        this.router.navigate(['/posm/posm-list']);
    }

    viewReason() {
        this.router.navigate(['/posm/reason']);
    }

    export() {
        this._service.POSMShop_Export(
            Helper.ProjectID(),
            Helper.IsNull(this.selectMonth) == true ? this.month : this.selectMonth.code,
            this.shop_code
        );
    }

    // 'xlsx'
    exportExcel() {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.dataError);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'posm_shop');
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }


}
