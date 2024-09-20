import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { AppComponent } from 'src/app/app.component';
import * as FileSaver from 'file-saver';
import { GiftsService } from 'src/app/web/service/gifts.service';
import { Pf } from 'src/app/_helpers/pf';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { FileService } from 'src/app/web/service/file.service';
import { Router } from '@angular/router';
import { MastersService } from 'src/app/web/service/masters.service';

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
    selector: 'app-gifts',
    templateUrl: './gifts.component.html',
    styleUrls: ['./gifts.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class GiftsComponent {
    items_menu: any = [
        { label: ' ACTIVATION' },
        { label: ' Gift', icon: 'pi pi-gift', routerLink: '/activation/gifts' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };

    giftDialog: boolean = false;
    isTypeGOTIT: boolean = false;
    openPrcsConfigDialog: boolean = false;
    products!: any[];
    gift!: any;

    actionGift: any = 'create';
    selectedGifts!: any[] | null;

    cols!: Column[];
    exportColumns!: ExportColumn[];

    GOTIT_productId: any = null;
    GOTIT_productPriceId: any = null;
    constructor(
        private _service: GiftsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private edService: EncryptDecryptService,
        private taskService: TaskFileService,
        private _file: FileService,
        private router: Router,
        private masters: MastersService
    ) {}

    menu_id = 70;
    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }

    configuration: any = [];
    project: any;
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter((d: any) => d.project_id == Helper.ProjectID())[0];
    }

    ngOnInit() {
        this.projectName();
        // this.productService.getProducts().then((data) => (this.products = data));
        try {
            this.check_permissions();
        } catch (error) {}

        this.getMaster('gifts_type', 'gifts', this.giftTypeList, 1);

        this.cols = [
            {
                field: 'error_name',
                header: 'Error Name',
                customExportHeader: 'Error Name',
            },
            { field: 'gift_code', header: 'Gift Code' },
            { field: 'gift_name', header: 'Gift Name' },
            { field: 'gift_type', header: 'Gift Type' },
            { field: 'amount', header: 'Amount' },
        ];
        this.exportColumns = this.cols.map((col: any) => ({
            title: col.header,
            dataKey: col.field,
        }));
        this.loadData(1);
        this.loadUser();
    }

    getMaster(ListCode: any, Table: any, list: any, key: any) {
        this.masters
            .ewo_GetMaster(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    // list = []
                    const result = data.data.filter(
                        (x: any) =>
                            x.Status == 1 &&
                            // x.ListCode == ListCode &&
                            x.Table == Table
                    );
                    result.forEach((element: any) => {
                        list.push({
                            id: element.Id,
                            name:
                                key == 1
                                    ? `${element.Code} - ${element.NameVN}`
                                    : `${element.NameVN}`,
                            code: element.Code,
                        });
                    });
                }
            });
    }

    currentUser: any;
    userProfile: any;

    loadUser() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.currentUser = JSON.parse(this.edService.decryptUsingAES256(_u));
        this.userProfile = this.currentUser.employee[0];
    }

    checkUser(): any {
        return this.userProfile?.employee_type_id == 1 ? true : false;
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

    gift_code: any = null;
    gift_name: any = null;
    gift_type: any = null;

    status: any = -1;

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

    selectStatus(e: any) {
        this.status = e.value === null ? -1 : e.value;
    }

    giftTypeList: any = [];
    selectedType: any;
    selectGiftType(event: any) {
        this.giftTypeList = Helper.IsNull(event) != true ? event.value : null;
    }

    listGitfs: any = [];
    loading: boolean = false;
    loadData(pageNumber: any) {
        if (pageNumber == 1) {
            this.first = 1;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }
        this.loading = true;
        this._service
            .gifts_GetList(
                this.rows,
                this._pageNumber,
                Helper.ProjectID(),
                this.gift_code,
                this.gift_name,
                this.gift_type,
                this.status
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listGitfs = data.data;
                    this.listGitfs = this.listGitfs.map((t: any) => ({
                        ...t,
                        _status: t.status == 1 ? true : false,
                        _created_by: `[${t.created_by}] - ${t.created_code} - ${t.created_name}`,
                        _toolTip:
                            Helper.IsNull(t.updated_by) != true
                                ? `Update By : [${t.updated_by}] - ${t.updated_code} - ${t.updated_name} | Update Date : ${t.updated_date}`
                                : '',
                    }));
                    this.totalRecords =
                        this.listGitfs.length > 0
                            ? this.listGitfs[0].TotalRows
                            : 0;
                    this.loading = false;
                } else {
                    this.listGitfs = [];
                    this.loading = false;
                }
            });
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

    showFilter: any = true;
    showFiltered() {
        this.showFilter = !this.showFilter;
    }

    fileImage: any = null;
    // On file Select
    onChangeImage(event: any) {
        this.fileImage = event.target.files[0];
        if (Helper.IsNull(this.fileImage) != true) {
            if (
                this.NofiImage(
                    this.fileImage.name.split('.').pop(),
                    'File image'
                ) == 1
            ) {
                this.clearFileInputImage();
                // this.clearImageType();
                return;
            } else {
                this.taskService
                    .ImageRender(this.fileImage, this.fileImage.name)
                    .then((file: any) => {
                        this.fileImage = file;
                    });

                const formUploadImage = new FormData();
                formUploadImage.append('files', this.fileImage);
                formUploadImage.append('ImageType', this.fileImage.name);
                formUploadImage.append('WriteLabel', this.fileImage.name);

                // this._file
                //     .UploadImage(formUploadImage)
                //     .subscribe((data: any) => {
                //         if (data.result == EnumStatus.ok) {
                //             this.gift.gift_image =
                //                 EnumSystem.fileLocal + data.data;
                //         }
                //     });

                const fileName = AppComponent.generateGuid();
                const newFile = new File(
                    [this.fileImage],
                    fileName +
                        this.fileImage.name.substring(
                            this.fileImage.name.lastIndexOf('.')
                        ),
                    { type: this.fileImage.type }
                );
                const modun = 'GIFT';
                const drawText = this.fileImage.name;
                this._file
                    .FileUpload(
                        newFile,
                        this.project.project_code,
                        modun,
                        drawText
                    )
                    .subscribe(
                        (response: any) => {
                            this.gift.gift_image = response.url;
                        },
                        (error: any) => {
                            this.gift.gift_image = null;
                        }
                    );
            }
        }
    }

    @ViewChild('myInputFileImage') myInputFileImage: any;
    clearFileInputImage() {
        this.myInputFileImage.nativeElement.value = null;
        this.fileImage = undefined;
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
        this._service.gifts_GetTemplate();
    }
    importTemplate() {
        if (
            this.NofiIsNull(this.file, 'file') == 1 ||
            this.NofiCheckFile(
                this.file.name.split('.').pop(),
                'File import'
            ) == 1
        ) {
            return;
        } else {
            this.clearDataImport();
            const formDataUpload = new FormData();
            formDataUpload.append('files', this.file);

            this._service
                .gifts_ImportData(formDataUpload, Helper.ProjectID())
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Gifts',
                            'Update Gifts Action',
                            'Update Gifts Action Successfully',
                            'success',
                            'Successfully'
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
                doc.save('GiftsAction.pdf');
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
            this.saveAsExcelFile(excelBuffer, 'GiftsAction');
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

    export() {
        this._service.gifts_RawData(
            1000000,
            1,
            Helper.ProjectID(),
            this.gift_code,
            this.gift_name,
            this.gift_type,
            -1
        );
    }

    openNew(action: any) {
        this.gift = {};
        this.actionGift = action;
        this.giftDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected gift?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter(
                    (val) => !this.selectedGifts?.includes(val)
                );
                this.selectedGifts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000,
                });
            },
        });
    }

    editGifts(gift: any, action: any) {
        this.gift = { ...gift };
        this.selectedType = this.giftTypeList.find(
            (e: any) => e.code == this.gift.gift_type
        );
        if (this.selectedType?.code === 'GOTIT') {
            this.isTypeGOTIT = true;
        } else if (this.selectedType?.code === 'PHYSICS') {
            this.isTypeGOTIT = false;
        }
        this.actionGift = action;
        this.giftDialog = true;
    }

    openConfig(item: any, action: any) {
        this.gift = { ...item };
        this.selectedType = this.giftTypeList.find(
            (e: any) => e.code == this.gift.gift_type
        );
        this.actionGift = action;
        this.openPrcsConfigDialog = true;

        this.configuration = item;
        if (this.configuration.config !== '') {
            const parsedObject = JSON.parse(this.configuration.config);
            const formattedJSON = JSON.stringify(parsedObject, null, 4);
            this.configuration.config = formattedJSON;
        }
    }

    deleteGifts(event: Event, gift: any, action: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Do you want to delete this record?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger',

            accept: () => {
                this.gift = gift;
                this.actionGift = action;
                this.saveGift();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    life: 3000,
                });
            },
        });
    }

    hideDialog() {
        this.giftDialog = false;
    }

    saveGift() {
        if (!Helper.IsNull(this.selectedType)) {
            this.gift.gift_type = this.selectedType.code || null;
            this.selectedType = null;
        }
        if (
            this.NofiIsNull(this.gift.gift_code, 'code') == 1 ||
            this.NofiEmptyCharacters(this.gift.gift_code, 'Gift code') == 1 ||
            this.NofiAccentedCharacters(this.gift.gift_code, 'Gift code') ==
                1 ||
            this.NofiSpecialCharacters(this.gift.gift_code, 'Gift code') == 1 ||
            // this.NofiLengthCode(this.gift.product_code, 'Product code') == 1 ||
            this.NofiIsNull(this.gift.gift_name, 'name') == 1 ||
            this.NofiIsNull(this.gift.gift_type, 'type') == 1 ||
            this.NofiEmptyCharacters(this.gift.gift_type, 'Gift type') == 1 ||
            this.NofiAccentedCharacters(this.gift.gift_type, 'Gift type') ==
                1 ||
            this.NofiSpecialCharacters(this.gift.gift_type, 'Gift type') == 1 ||
            this.checkNumber(this.gift.amount, 'Amount') == 1
        ) {
            return;
        } else {
            this._service
                .gifts_GetList(1000000, 1, Helper.ProjectID(), '', '', '', -1)
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        try {
                            var id =
                                this.actionGift == 'create' ? 0 : this.gift.id;
                            const giftList = data.data.filter(
                                (x: any) =>
                                    x.id != id &&
                                    x.gift_code.toUpperCase() ==
                                        this.gift.gift_code.toUpperCase()
                            );

                            if (giftList.length > 0) {
                                this.messageService.add({
                                    severity: 'warn',
                                    summary: 'Warning',
                                    detail: 'Gift code already exist',
                                });

                                return;
                            } else {
                                console.log(
                                    Helper.ProjectID(),
                                    this.actionGift == 'create'
                                        ? 0
                                        : this.gift.id,
                                    this.gift.gift_code,
                                    this.gift.gift_name,
                                    this.gift.gift_type,
                                    this.gift.gift_image,
                                    this.gift.amount,
                                    this.gift._status == true ? 1 : 0,
                                    this.actionGift
                                );

                                var action = this.getAction(this.actionGift);

                                this._service
                                    .gifts_Action(
                                        Helper.ProjectID(),
                                        this.actionGift == 'create'
                                            ? 0
                                            : this.gift.id,
                                        this.gift.gift_code,
                                        this.gift.gift_name,
                                        this.gift.gift_type,
                                        (this.gift.configuration = ''),
                                        this.gift.gift_image,
                                        this.gift.amount,
                                        this.gift.GOTIT_productId,
                                        this.gift.GOTIT_productPriceId,
                                        this.gift._status == true ? 1 : 0,
                                        this.actionGift
                                    )
                                    .subscribe((data: any) => {
                                        if (data.result == EnumStatus.ok) {
                                            this.NofiResult(
                                                'Page Gift',
                                                `${action} gift`,
                                                `${action} gift success`,
                                                'success',
                                                'SuccessFull'
                                            );
                                        } else {
                                            this.NofiResult(
                                                'Page Gift',
                                                `${action} gift`,
                                                `${action} gift error`,
                                                'error',
                                                'Error'
                                            );
                                        }
                                    });

                                this.clearSaveGift();
                            }
                        } catch (error) {}
                    }
                });
        }
    }

    selectedGiftType(event: any) {
        if (event.value.code === 'GOTIT') {
            this.isTypeGOTIT = true;
        } else if (event.value.code === 'PHYSICS') {
            this.isTypeGOTIT = false;
        }
    }

    clearSaveGift() {
        this.giftDialog = false;
        this.gift = {};
        this.actionGift = 'create';
        this.loadData(1);
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

    checkNumber(value: any, name: any): any {
        if (
            Helper.IsNull(value) != true &&
            (Helper.number(value) != true || value < 0)
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            return 1;
        }
        return 0;
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

    // Shop code is not allowed to enter accented characters
    NofiAccentedCharacters(value: any, name: any): any {
        if (Pf.checkUnsignedCode(value) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' is not allowed to enter accented characters',
            });
            return 1;
        }
        return 0;
    }

    // Shop code must not contain empty characters
    NofiEmptyCharacters(value: any, name: any): any {
        if (Pf.checkSpaceCode(value) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' must not contain empty characters',
            });
            return 1;
        }
        return 0;
    }

    // Product codes cannot contain special characters
    NofiSpecialCharacters(value: any, name: any): any {
        if (Pf.CheckAccentedCharacters(value) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' cannot contain special characters',
            });
            return 1;
        }
        return 0;
    }

    // Product codes cannot contain special characters
    NofiLengthCode(value: any, name: any): any {
        if (Pf.CheckCode(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' must be greater than or equal to 8 characters',
            });

            return 1;
        }
        return 0;
    }

    NofiImage(value: any, name: any): any {
        let check = 0;
        if (value != 'png' && value != 'jpg' && value != 'jpeg') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            check = 1;
        }
        return check;
    }

    getAction(value: any): any {
        let result = '';
        if (value == 'create') {
            result = 'Create';
        } else if (value == 'update') {
            result = 'Update';
        } else {
            result = 'Delete';
        }
        return result;
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

    updateConfig() {
        var action = this.getAction(this.actionGift);
        this._service
            .gifts_Action(
                Helper.ProjectID(),
                this.actionGift == 'create' ? 0 : this.gift.id,
                this.gift.gift_code,
                this.gift.gift_name,
                this.gift.gift_type,
                (this.gift.configuration = this.configuration.configuration),
                this.gift.gift_image,
                this.gift.amount,
                this.gift.GOTIT_productId,
                this.gift.GOTIT_productPriceId,
                this.gift._status == true ? 1 : 0,
                this.actionGift
            )
            .subscribe((data: any) => {
                this.openPrcsConfigDialog = false;
                if (data.result == EnumStatus.ok) {
                    this.NofiResult(
                        'Page Gift',
                        `${action} gift`,
                        `${action} gift success`,
                        'success',
                        'SuccessFull'
                    );
                } else {
                    this.NofiResult(
                        'Page Gift',
                        `${action} gift`,
                        `${action} gift error`,
                        'error',
                        'Error'
                    );
                }
            });
    }

    someObject(item: any) {
        try {
            return JSON.parse(item);
        } catch (e) {
            return item;
        }
    }
    checkSomeObject(item: any) {
        try {
            let t = JSON.parse(item);
            return 0;
        } catch (e) {
            return 1;
        }
    }
}
