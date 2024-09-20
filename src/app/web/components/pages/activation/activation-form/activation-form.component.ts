import { Component, OnInit, ViewChild } from '@angular/core';
import { PromotionService } from 'src/app/web/service/promotion.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Message, MessageService } from 'primeng/api';
import { Pf } from 'src/app/_helpers/pf';
import { ExportService } from 'src/app/web/service/export.service';
import { AppComponent } from 'src/app/app.component';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { ActivationService } from 'src/app/web/service/activation.service';

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
    selector: 'app-activation-form',
    templateUrl: './activation-form.component.html',
    styleUrls: ['./activation-form.component.scss'],
})
export class ActivationFormComponent implements OnInit {
    constructor(
        private _service: ActivationService,
        private messageService: MessageService,
        private router: Router,
        private edService: EncryptDecryptService
    ) {}

    items_menu: any = [
        { label: ' ACTIVATION' },
        {
            label: ' Form ',
            icon: 'pi pi-box',
            routerLink: 'activation/activation-form',
        },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    icon_eye = 'pi pi-eye';

    menu_id = 83;
    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }

    form_name: any = '';
    status: any = -1;

    messages!: Message[];
    showFiter: boolean = true;
    item_Product: any = 0;
    itemProduct: any = null;
    dataOneForm!: any;
    dataForm: any[] = [];
    PromotionCreate: boolean = false;
    // clone
    selectPromotion: any;
    listPromotion: any = [];
    allPromotionCode!: any;

    statuses: any = [
        {
            title: 'Active',
            value: 1,
        },
        {
            title: 'In Active',
            value: 0,
        },
    ];

    date: any = [];
    minDate: any = null;
    maxDate: any = null;
    startDate: any = null;
    endDate: any = null;
    rangeDates: any = [];

    getDate() {
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = month === 0 ? 11 : month - 1;
        let prevYear = prevMonth === 11 ? year - 1 : year;
        let nextMonth = month === 11 ? 0 : month + 1;
        let nextYear = nextMonth === 0 ? year + 1 : year;

        this.minDate = new Date();
        this.minDate.setDate(1);
        this.maxDate = new Date();
        this.maxDate.setDate(31);

        this.startDate = new Date();
        this.endDate = new Date();

        // minDate - minDate ( Today : 01/03/2024 || 02/03/2024)
        this.date[0] = new Date(today);
        this.date[1] = new Date(this.maxDate);
        this.setDate(this.date);
    }

    cols!: Column[];
    exportColumns!: ExportColumn[];
    ngOnInit(): void {
        // this.getDataForm()
        // this.getDate();
        this.cols = [
            // { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            {
                field: 'error_name',
                header: 'Error Name',
                customExportHeader: 'Error Name',
            },
            { field: 'promotion_code', header: 'Promotion Code' },
            { field: 'promotion_group', header: 'Promotion Group' },
            { field: 'form_name', header: 'Promotion Name' },
            { field: 'desc_image', header: 'Image' },
            { field: 'status', header: 'Status' },
        ];
        this.exportColumns = this.cols.map((col: any) => ({
            title: col.header,
            dataKey: col.field,
        }));
        this.getDataForm(1);
        // listPromotion
    }

    currentUser: any;
    user_profile: any;
    userProfile: any;
    loadUser() {
        if (this.user_profile == EnumSystem.current) {
            let _u = localStorage.getItem(EnumLocalStorage.user);

            this.currentUser = JSON.parse(
                this.edService.decryptUsingAES256(_u)
            );
            this.currentUser.employee[0]._status =
                this.currentUser.employee[0].status == 1 ? true : false;
            this.userProfile = this.currentUser.employee[0];
        }
    }

    getListPromotion() {
        this._service
            .Promotion_GetList(
                Helper.ProjectID(),
                '',
                '',
                '',
                -1,
                0,
                0,
                100000,
                this.numberPage
            )
            .subscribe((res: any) => {
                if (res.result == EnumStatus.ok) {
                    const data = res.data.map((e: any) => ({
                        name: e.promotion_code + '-' + e.form_name,
                        value: e.form_id,
                        code: e.promotion_code,
                        TotalRows: e.TotalRows,
                    }));
                    this.listPromotion = data;
                    this.totalRecords =
                        this.listPromotion.length > 0
                            ? this.listPromotion[0].TotalRows
                            : 0;
                }
            });
    }
    _pageNumber: number = 1;

    getDataForm(pageNumber: number) {
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }

        this.setDate(this.date);
        // project_id, form_name, status, from_date, to_date, rowPerPage, pageNumber
        this._service
            .activation_form_GetList(
                Helper.ProjectID(),
                this.form_name,
                this.status,
                this.from_date,
                this.to_date,
                this.rows,
                this._pageNumber
            )
            .subscribe((res: any) => {
                if (res.result === EnumStatus.ok) {
                    res.data.data = res.data.data.map((x: any) => ({
                        ...x,
                        tooltip:
                            Helper.IsNull(x.created_by) != true
                                ? `Create: [${x.created_by}] - ${x.create_code} - ${x.create_name} | Create Date: ${x.created_date}`
                                : ``,
                        _from_date:
                            Helper.IsNull(x.from_date) != true
                                ? Helper.convertDateStr1(x.from_date)
                                : null,
                        _to_date:
                            Helper.IsNull(x.to_date) != true
                                ? Helper.convertDateStr1(x.to_date)
                                : null,
                    }));
                    this.dataForm = res.data.data;
                    this.totalRecords =
                        this.dataForm.length > 0
                            ? this.dataForm[0].TotalRows
                            : 0;
                }
            });
    }

    selectStatus(e: any) {
        this.status = e.value === null ? -1 : e.value;
    }

    from_date: any = null;
    to_date: any = null;

    setDate(date: any) {
        if (Helper.IsNull(date) != true) {
            this.from_date = Helper.convertDate(new Date(date[0]));
            this.to_date = Helper.convertDate(new Date(date[1]));

            this.from_date = Helper.transformDateInt(new Date(this.from_date));
            this.to_date = Helper.transformDateInt(new Date(this.to_date));
        } else {
            this.from_date = null;
            this.to_date = null;
        }
    }
    handleFilter() {
        this.getDataForm(1);
    }

    showFilter() {
        this.showFiter = !this.showFiter;
    }

    create() {
        (this.PromotionCreate = true), (this.dataOneForm = undefined);
    }

    export() {
        this._service.activation_form_RawData(
            Helper.ProjectID(),
            this.form_name,
            this.status,
            this.from_date,
            this.to_date,
            1000000,
            1
        );
    }

    first: number = 0;
    rows: number = 20;
    numberPage: number = 1;
    totalRecords: number = 0;
    onPageChange(e: any) {
        this.first = e.first;
        this.rows = e.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;
        this.getDataForm(this._pageNumber);
    }

    update(e: any) {
        this.PromotionCreate = true;
        this.dataOneForm = this.dataForm.filter(
            (i: any) => i.form_id == e.form_id
        );
        this.dataOneForm = this.dataOneForm.map((x: any) => ({
            ...x,
            _from_date1:
                Helper.IsNull(x.from_date) != true
                    ? new Date(Helper.convertDateStr(x.from_date))
                    : '',
            _to_date1:
                Helper.IsNull(x.to_date) != true
                    ? new Date(Helper.convertDateStr(x.to_date))
                    : '',
        }));
    }

    actionHiddenShow(e: any) {
        this.PromotionCreate = false;
        this.handleFilter();
    }

    checkSpaceAndCharacter(value: any, name: string) {
        let check = 0;
        if (Pf.CheckAccentedCharacters(value) || Pf.checkSpace(value)) {
        }
        return check;
    }

    typeImport: number = 0;
    showTemplate: number = 0;
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
        this._service.Promotion_GetTemplate(Helper.ProjectID());
    }
    importTemplate() {
        if (Helper.IsNull(this.file) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter file',
            });
            return;
        } else {
            this.clearDataImport();
            this.setDate(this.date);
            const formDataUpload = new FormData();
            formDataUpload.append('files', this.file);

            this._service
                .Promotion_ImportData(
                    formDataUpload,
                    Helper.ProjectID(),
                    this.from_date,
                    this.to_date
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Promotion',
                            'Add Promotion',
                            'Add Promotion Successfull',
                            'success',
                            'Successfull'
                        );
                        this.handleFilter();
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
                doc.save('products.pdf');
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
            this.saveAsExcelFile(excelBuffer, 'promotion');
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

    readData(event: any) {
        if (event == true) {
            this.getDataForm(1);
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

    getSeverity(value: any): any {
        switch (value) {
            case 0:
                return 'danger';
            case 1:
                return 'success';
            default:
                return 'warning';
        }
    }
}
