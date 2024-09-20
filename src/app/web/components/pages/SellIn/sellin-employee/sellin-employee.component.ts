import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { SellOutService } from 'src/app/web/service/sell-out.service';
import * as FileSaver from 'file-saver';
import { AppComponent } from 'src/app/app.component';
import { Pf } from 'src/app/_helpers/pf';
import { SellInService } from 'src/app/web/service/sell-in.service';

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
    selector: 'app-sellin-employee',
    templateUrl: './sellin-employee.component.html',
    styleUrls: ['./sellin-employee.component.scss'],
    providers: [ConfirmationService],
})
export class SellinEmployeeComponent {
    employeeDialog: boolean = false;
    products!: any[];
    product!: any;
    selectedProducts!: any[] | null;
    submitted: boolean = false;
    statuses!: any[];

    constructor(
        private _service: SellInService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    project_id: any;
    ngOnInit() {
        this.project_id = Helper.ProjectID();
        this.cols = [
            {
                field: 'error_name',
                header: 'Error Name',
                customExportHeader: 'Error Name',
            },
            { field: 'employee_code', header: 'Employee Code' },
            { field: 'value', header: 'value' },
        ];
        this.exportColumns = this.cols.map((col: any) => ({
            title: col.header,
            dataKey: col.field,
        }));

        this.getMonth();
        this.loadData(1);
    }

    items_menu: any = [
        { label: ' SELLIN' },
        {
            label: ' Employee Action',
            icon: 'pi pi-user',
            routerLink: '/sellin-employee',
        },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };

    cols!: Column[];
    exportColumns!: ExportColumn[];

    employee_id: any = null;
    value: any = null;
    selectEmployee(event: any) {
        this.employee_id = '';
        if (Helper.IsNull(event) != true) {
            event.forEach((element: any) => {
                this.employee_id += element != null ? element.code + ' ' : '';
            });
        } else {
            this.employee_id = '';
        }
        console.log('employee_id : ', this.employee_id);
    }

    clearSelectEmployee(event: any) {
        this.employee_id = event == true ? '' : this.employee_id;
    }

    first: number = 0;
    rows: number = 20;
    totalRecords: number = 0;
    _pageNumber: any = 0;
    onPageChange(e: any) {
        this.first = e.first;
        this.rows = e.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;
        this.loadData(this._pageNumber);
    }

    showFiter: any = true;
    showFilter() {
        this.showFiter = !this.showFiter;
    }

    currentDate: any = null;
    listMonth: any = null;
    year_month: any = null;
    getMonth() {
        const date = new Date();
        const year = date.getFullYear();
        const monthToday = date.getMonth() + 1;
        const monthString = monthToday.toString().padStart(2, '0');
        this.currentDate = parseInt(year + monthString);

        for (let i = 1; i <= 12; i++) {
            const month = i.toString().padStart(2, '0');

            const dataMonth = Helper.getMonth();
            this.listMonth = dataMonth.ListMonth;
            // this.listMonth = this.listMonth?.filter((i: any) => i?.code >= this.currentDate)
        }
        this.year_month = this.listMonth?.find(
            (i: any) => i?.code == this.currentDate
        );
    }

    listSellInEmployee: any = [];
    loading: boolean = false;
    loadData(pageNumber: any) {
        if (pageNumber == 1) {
            this.first = 1;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }
        this.loading = true;
        this._service
            .SellIn_Employee_GetList(
                Helper.ProjectID(),
                Helper.IsNull(this.year_month) != true
                    ? this.year_month.code
                    : 0,
                this.employee_id,
                this.rows,
                this._pageNumber
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listSellInEmployee = data.data;
                    this.listSellInEmployee = this.listSellInEmployee.map(
                        (t: any) => ({
                            ...t,
                            _year_month: Helper.transformYearMonth(
                                t.year_month + ''
                            ),
                            _toolTip: `Create By : [${t.created_by}] - ${t.create_code} - ${t.create_name} | Create Date : ${t.created_date}`,
                        })
                    );
                    this.totalRecords =
                        this.listSellInEmployee.length > 0
                            ? this.listSellInEmployee[0].TotalRows
                            : 0;
                    this.loading = false;
                } else {
                    this.listSellInEmployee = [];
                    this.loading = false;
                }
            });
    }
    openNew() {
        this.product = {};
        this.submitted = false;
        this.employeeDialog = true;
    }

    editProduct(product: any) {
        this.product = { ...product };
        this.employeeDialog = true;
    }

    hideDialog() {
        this.employeeDialog = false;
        this.submitted = false;
    }

    saveEmployee() {
        this.submitted = true;
        if (
            this.NofiIsNull(this.year_month, 'year month') == 1 ||
            this.NofiIsNull(this.employee_id, 'employee') == 1 ||
            this.checkValue(this.value, 'value') == 1
        ) {
            return;
        } else {
            this._service
                .SellIn_Employee_Action(
                    Helper.ProjectID(),
                    this.year_month.code,
                    this.employee_id,
                    this.value
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Employee Action',
                            'Update Employee Action',
                            'Update Employee Action Successfull',
                            'success',
                            'SuccessFull'
                        );
                        this.loadData(1);
                        this.clearSaveEmployee();
                    }
                });
        }
    }

    clearSaveEmployee() {
        this.value = null;
        this.employeeDialog = false;
        this.product = {};
    }

    export() {
        this._service.SellIn_Employee_RawData(
            Helper.ProjectID(),
            Helper.IsNull(this.year_month) != true ? this.year_month.code : 0,
            this.employee_id,
            100000000,
            1
        );
    }

    showTemplate: any = 0;
    typeImport: number = 0;
    ShowHideTemplate(value: any) {
        if (this.showTemplate == 0) {
            this.showTemplate = 1;
            this.typeImport = value;
            this.clearDataImport();
        } else {
            this.showTemplate = 0;
        }
    }

    file!: any;
    // On file Select
    onChange(event: any) {
        this.clearDataImport();
        this.file = event.target.files[0];
    }

    @ViewChild('myInputFile') myInputFile: any;
    clearFileInput() {
        this.myInputFile.nativeElement.value = null;
        this.file = undefined;
    }
    dataError: any;
    dataMessError: any;
    clearDataImport() {
        this.dataError = undefined;
        this.dataMessError = undefined;
    }

    getTemplate() {
        this._service.SellIn_Employee_GetTemplate(Helper.ProjectID());
    }
    importTemplate() {
        if (
            this.NofiIsNull(this.file, 'file') == 1 ||
            this.NofiCheckFile(
                this.file.name.split('.').pop(),
                'File import'
            ) == 1 ||
            this.NofiIsNull(this.year_month, 'year_month') == 1
        ) {
            return;
        } else {
            this.clearDataImport();
            const formDataUpload = new FormData();
            formDataUpload.append('files', this.file);

            this._service
                .SellIn_Employee_ImportData(
                    formDataUpload,
                    Helper.ProjectID(),
                    Helper.IsNull(this.year_month) != true
                        ? this.year_month.code
                        : 0
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Employee Action',
                            'Update Employee Action',
                            'Update Employee Action Successfull',
                            'success',
                            'Successfull'
                        );
                        this.loadData(1);
                    } else {
                        if (data.data == null) {
                            this.dataMessError = data.message;
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Warning',
                                detail: this.dataMessError,
                            });
                        } else {
                            this.dataError = data.data;
                        }
                    }
                    this.clearFileInput();
                });
        }
    }
    // 'jspdf' - 'jspdf-autotable'
    exportPdf(title: any, value: any) {
        import(title).then((jsPDF) => {
            import(value).then((x) => {
                const doc = new jsPDF.default('p', 'px', 'a4');
                (doc as any).autoTable(this.exportColumns, this.dataError);
                doc.save('SellInEmployee.pdf');
            });
        });
    }

    // 'xlsx'
    exportExcel() {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.dataError);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ['data'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'SellInEmployee');
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(
            data,
            fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
        );
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string): any {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
        }
    }

    // notification
    NofiIsNull(value: any, name: any): any {
        let check = 0;
        if (Helper.IsNull(value) == true || Pf.checkSpace(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            check = 1;
        }
        return check;
    }
    checkValue(value: any, name: any): any {
        let check = 0;
        if (value < 0 || (value != 0 && Helper.IsNull(value) == true)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: `Please enter ${name} larger or equal to 0`,
            });
            check = 1;
        }
        return check;
    }

    NofiIsNullNumber(value: any, name: any): any {
        let check = 0;
        if (
            Helper.IsNullTypeNumber(value) == true ||
            Pf.checkSpace(value) != true
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            check = 1;
        }
        return check;
    }

    NofiCheckFile(value: any, name: any): any {
        let check = 0;
        if (value != 'xlsx') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            check = 1;
            this.clearFileInput();
        }
        return check;
    }

    NofiResult(page: any, action: any, name: any, severity: any, summary: any) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: name,
            life: 3000,
        });

        AppComponent.pushMsg(
            page,
            action,
            name,
            severity == 'success' ? EnumStatus.ok : EnumStatus.error,
            0
        );
    }
}
