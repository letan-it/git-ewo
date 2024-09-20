import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    ViewChild,
    Output,
    EventEmitter,
    ChangeDetectorRef,
} from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { PromotionService } from 'src/app/web/service/promotion.service';
import { SurveyService } from 'src/app/web/service/survey.service';
import { ConfirmationService } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import * as FileSaver from 'file-saver';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { FileService } from 'src/app/web/service/file.service';
import { ProductService } from 'src/app/web/service/product.service';
import { ActivationService } from 'src/app/web/service/activation.service';
import { GiftsService } from 'src/app/web/service/gifts.service';

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
    selector: 'app-activation-form-details',
    templateUrl: './activation-form-details.component.html',
    styleUrls: ['./activation-form-details.component.scss'],
    providers: [ConfirmationService],
})
export class ActivationFormDetailsComponent implements OnInit, OnChanges {
    @Input() data: any;
    @Output() outValue = new EventEmitter<any>();

    constructor(
        private _service: ActivationService,
        private _serviceSurvey: SurveyService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private edService: EncryptDecryptService,
        private _file: FileService,
        private carService_Product: ProductService,
        private carService_Gift: GiftsService,
        private cdr: ChangeDetectorRef
    ) {}

    tap: number = 0;

    form_id!: number;
    form_decription!: any;
    formula!: any;
    status!: number;
    desc_image!: any;
    create_name!: any;
    configuration: any = null;
    created_date!: any;
    update_date!: any;
    update_name!: any;
    // detail
    dataProduct!: any[];
    dataSurvey!: any[];
    // product
    inputAction: any;
    mindata: number = 1;
    maxdata: any = null;
    product_target: any = null;
    chooseAction!: string;
    listSurvey: any;
    buttons!: any[];

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

    // setup config library
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        translate: 'no',
        placeholder: 'Enter text here...',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',

        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText',
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
    };

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] && this.data !== undefined) {
            this.form_id = this.data.form_id;
            this.form_decription = this.data.form_decription;
            this.formula = this.data.formula;
            this.status = this.data.status;
            this.desc_image = this.data.desc_image
                ? this.data.desc_image
                : EnumSystem.noImage;
            this.create_name = this.data.create_name;
            this.created_date = this.data.created_date;
            this.update_name = this.data.update_name;
            (this.update_date = this.data.update_date),
                (this.configuration = this.data.configuration);

            this.getItemForm();
        }

        this.getData();
    }

    cols!: Column[];
    exportColumns!: ExportColumn[];
    project: any;
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter((d: any) => d.project_id == Helper.ProjectID())[0];
    }
    ngOnInit(): void {
        this.projectName();
        this.type = [
            { name: 'SURVEY', key: 'SURVEY' },
            { name: 'SELLOUT', key: 'SELLOUT' },
            { name: 'GIFT', key: 'GIFT' },
            { name: 'GAME', key: 'GAME' },
        ];

        this.loadUser();
        this.checkActionUser();

        this.cols = [
            // { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            {
                field: 'error_name',
                header: 'Error Name',
                customExportHeader: 'Error Name',
            },
            { field: 'form_id', header: 'Promotion Id' },
            { field: 'item_data', header: 'Item Data' },
            { field: 'survey_id', header: 'Survey Id' },
            { field: 'product_id', header: 'Product Id' },
            { field: 'min_data', header: 'Min Data' },
            { field: 'max_data', header: 'Max Data' },
        ];
        this.exportColumns = this.cols.map((col: any) => ({
            title: col.header,
            dataKey: col.field,
        }));

        this._serviceSurvey
            .ewo_GetSurveyList(Helper.ProjectID())
            .subscribe((res: any) => {
                if (res.result == EnumStatus.ok) {
                    res.data = res.data.filter((x: any) => x.status == 1);
                    this.listSurvey = res.data?.map((i: any) => ({
                        name: `[${i.survey_id}] - ${i.survey_name}`,
                        code: i.survey_id,
                    }));
                }
            });

        this.buttons = [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                    // this.editDialog()
                },
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {
                    this.confirmDelete();
                },
            },
        ];
    }

    getData() {
        // this.form_id = this.data?.form_id
        // this._service.Promotion_item_GetList(Helper.ProjectID(), this.data?.form_id).subscribe((res: any) => {
        //   if (res.result == EnumStatus.ok) {
        //     res.data = res.data.map((x: any) => ({
        //       ...x,
        //       tooltip: x.update_by != null ? `Update By : [${x.update_by}] - ${x.update_code} - ${x.update_name} Time : ${x.update_date}` : null
        //     }))
        //     this.dataProduct = res.data.filter((e: any) => e.item_data == 'PRODUCT')
        //     this.dataSurvey = res.data.filter((e: any) => e.item_data == 'SURVEY')
        //   }
        // })
    }

    showDescription: boolean = false;
    showDescript() {
        this.showDescription = !this.showDescription;
    }

    actionSubmit(): void {
        if (this.tap === 0) {
            this.handleActionProduct('create.update');
        } else {
            this.handleActionGift('create.update');
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

    checkMinMax(min: number, max: any) {
        let check = 0;
        if (min != null && max != null && max != '') {
            if (!Pf.IsNumber(min) && !Pf.IsNumber(max)) {
                if (min > max) {
                    check = 1;
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Warning',
                        detail: 'Min cannot be larger than Max !',
                    });
                }
            } else {
                check = 1;
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: name + 'not number!',
                });
            }
        }
        return check;
    }

    handleActionProduct(action: string) {
        if (
            this.NofiIsNull(this.inputAction, 'list product') == 1 ||
            this.checkDuplicates(
                this.inputAction.split(' ').filter((e: any) => e != ''),
                'Duplicate product code '
            ) == 1
        ) {
            return;
        } else {
            this._service
                .Promotion_product_Action(
                    Helper.ProjectID(),
                    0,
                    this.form_id,
                    this.inputAction,
                    action
                )
                .subscribe((res: any) => {
                    if (res.result == EnumStatus.ok) {
                        this.getData();
                        if (action == 'create.update') {
                            this.NofiResult(
                                'Page Promotion',
                                'Create/Update promotion item',
                                `Successfully edited product
             ${this.inputAction} in item promotion `,
                                'success',
                                'Successfull'
                            );
                            this.clearInputProduct();
                        } else {
                            this.NofiResult(
                                'Page Promotion',
                                'Delete promotion item',
                                `Successfully delete product 
            ${this.inputAction} in item promotion `,
                                'success',
                                'Successfull'
                            );
                            this.clearInputProduct();
                        }
                        this.getItemForm();
                    }
                });
        }
    }

    clearInputProduct() {
        this.inputAction = null;
    }

    handleActionGift(action: string) {
        if (
            this.NofiIsNull(this.inputAction, 'list gift') == 1 ||
            this.checkDuplicates(
                this.inputAction.split(' ').filter((e: any) => e != ''),
                'Duplicate gift code '
            ) == 1
        ) {
            return;
        } else {
            this._service
                .Promotion_gift_Action(
                    Helper.ProjectID(),
                    0,
                    this.form_id,
                    this.inputAction,
                    action
                )
                .subscribe((res: any) => {
                    if (res.result == EnumStatus.ok) {
                        if (action == 'create.update') {
                            this.NofiResult(
                                'Page Promotion',
                                'Update promotion',
                                `Successfully edited gift in item promotion `,
                                'success',
                                'Successfull'
                            );
                            this.clearInputGift();
                        } else {
                            this.NofiResult(
                                'Page Promotion',
                                'Delete promotion',
                                `Successfully delete gift item promotion `,
                                'success',
                                'Successfull'
                            );
                            this.clearInputGift();
                        }

                        this.getItemForm();
                    }
                });
        }
    }

    clearInputGift() {
        this.inputAction = null;
    }

    deleteProduct() {
        this.handleActionProduct('delete');
    }

    first = 0;
    rows = 10;
    pageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }

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

    checkDuplicates(value: any, name: any): any {
        let check = 0;
        if (Helper.checkDuplicates(value) != null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: `${name} : ${Helper.checkDuplicates(value)}`,
            });
            check = 1;
        } else {
            check = 0;
        }
        return check;
    }

    // action survey
    confirmDelete() {
        if (this.NofiIsNull(this.inputAction, 'input') == 1) {
            return;
        }

        this.confirmationService.confirm({
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (this.tap == 0) {
                    this.deleteProduct();
                } else {
                    this.deleteSurvey();
                }
            },
        });
    }

    onChangeTab(e: any) {
        this.tap = e.index;
    }

    deleteSurvey() {
        this.handleActionGift('delete');
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
        this._service.Promotion_item_GetTemplate(Helper.ProjectID());
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
            const formDataUpload = new FormData();
            formDataUpload.append('files', this.file);

            this._service
                .Promotion_item_ImportData(formDataUpload, Helper.ProjectID())
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Promotion',
                            'Add Promotion Item',
                            'Add Promotion Item Successfull',
                            'success',
                            'Successfull'
                        );
                        // this.handleFilter()
                        this.outValue.emit(true);
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

    currentUser: any;
    userProfile: any;
    loadUser() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.currentUser = JSON.parse(this.edService.decryptUsingAES256(_u));
        this.currentUser.employee[0]._status =
            this.currentUser.employee[0].status == 1 ? true : false;
        this.userProfile = this.currentUser.employee[0];
    }
    checkAction: boolean = false;
    checkActionUser(): any {
        if (Helper.IsNull(this.userProfile) != true) {
            this.checkAction =
                this.userProfile.employee_type_id == 1 ? true : false;
        } else {
            this.checkAction = false;
        }
    }

    NofiFileUpload(value: any, name: any): any {
        let check = 0;
        if (value != 'js') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            check = 1;
        }
        return check;
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

    getSeverityStatus(value: any): any {
        switch (value) {
            case 0:
                return 'danger';
            case 1:
                return 'success';
            default:
                return 'warning';
        }
    }

    // SURVEY SELLOUT GIFT
    getSeverity(value: any): any {
        switch (value) {
            case 'SURVEY':
                return 'info';
            case 'SELLOUT':
                return 'success';
            case 'GIFT':
                return 'warning';
            default:
                return 'danger';
        }
    }

    //////////////////////////// PICK LIST ///////////////////////////

    sourceProducts: any = [];
    targetProducts: any = [];

    sourceItem: any = [];
    getItemForm() {
        this._service
            .activation_form_setting_GetList(Helper.ProjectID(), this.form_id)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    // console.log(data.data.data);
                    data.data.data = data.data.data.map((x: any) => ({
                        ...x,
                        _status: x.status == 1 ? true : false,
                        tooltip:
                            Helper.IsNull(x.created_by) != true
                                ? `Create: [${x.created_by}] - ${x.create_code} - ${x.create_name} | Create Date: ${x.created_date}`
                                : ``,
                    }));
                    this.sourceItem = data.data.data;
                }
            });
    }

    @ViewChild('myInputFormulaFile') myInputImage: any;
    clearFormulaFile() {
        try {
            this.myInputImage.nativeElement.value = null;
        } catch (error) {}
    }

    fileUpload: any;
    url: any = '';
    onUploadFormulaFile(event: any) {
        this.fileUpload = event.target.files[0];
        if (Helper.IsNull(this.fileUpload) != true) {
            if (
                this.NofiFileUpload(
                    this.fileUpload.name.split('.').pop(),
                    'Formula File'
                ) == 1
            ) {
                this.clearFormulaFile();
                this.formItem.formula_file = null;
                return;
            } else {
                const formUploadImage = new FormData();
                formUploadImage.append('files', this.fileUpload);
                formUploadImage.append('ImageType', this.fileUpload.name);

                // this._file
                //   .UploadFile(formUploadImage)
                //   .subscribe((data: any) => {
                //     if (data.result == EnumStatus.ok) {
                //       this.formItem.formula_file = EnumSystem.fileLocal + data.data;
                //     } else {
                //       this.formItem.formula_file = null;
                //       this.clearFormulaFile();
                //     }
                //   });

                const fileName = AppComponent.generateGuid();
                const newFile = new File(
                    [this.fileUpload],
                    fileName +
                        this.fileUpload.name.substring(
                            this.fileUpload.name.lastIndexOf('.')
                        ),
                    { type: this.fileUpload.type }
                );
                const modun = 'FORMULA-FILE';
                const drawText = this.fileUpload.name;
                this._file
                    .FileUpload(
                        newFile,
                        this.project.project_code,
                        modun,
                        drawText
                    )
                    .subscribe(
                        (response: any) => {
                            this.formItem.formula_file = response.url;
                        },
                        (error: any) => {
                            this.formItem.formula_file = null;
                            this.clearFormulaFile();
                        }
                    );
            }
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a file upload',
            });
            return;
        }
    }

    selectSurvey(event: any) {
        this.formItem.survey_id = event != null ? event.Id : 0;
    }

    selectStatus(e: any) {
        this.formItem.status = e.value === null ? -1 : e.value;
    }

    type: any = [];

    formDialog: any = false;
    formItem: any = [];
    action: any = 'create.update';
    key: any = 1;

    deleteItem(event: Event, item: any, action: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Do you want to delete this record?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger',

            accept: () => {
                this.formItem = item;
                this.action = action;
                this.saveForm();
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

    statusAction: boolean = false;
    editDialog(item: any, action: any, key: any) {
        this.formItem = item;
        if (key === 1) {
            this.statusAction = false;
            this.formItem.key = 1;
            this.formDialog = true;
            // console.log(this.type);
        } else if (key === 2) {
            this.statusAction = true;
            this.formItem.key = 2;
            this.formDialog = true;
            if (Helper.IsNull(item) != true) {
                this.formItem._type_form = this.type.filter(
                    (t: any) => t.key == item.type_form
                )[0];
                this.formItem.survey = {
                    Id: item.survey_id,
                    Name: `[${item.survey_id}] - ${item.survey_name}`,
                    Order: item.orders,
                };
            }
        }
    }

    hideDialog() {
        this.formDialog = false;
    }

    saveForm() {
        if (
            (this.action == 'create.update' &&
                this.NofiIsNull(this.formItem._type_form, 'type form') == 1) ||
            (this.action == 'create.update' &&
                this.formItem._type_form.key == 'SURVEY' &&
                this.NofiIsNull(this.formItem.survey_id, 'survey') == 1) ||
            (this.action == 'create.update' &&
                (this.formItem._type_form.key == 'GIFT' ||
                    this.formItem._type_form.key == 'GAME') &&
                this.NofiIsNull(this.formItem.formula_file, 'formula file') ==
                    1) ||
            (this.action == 'create.update' &&
                Helper.IsNull(this.formItem.orders) != true &&
                this.checkNumber(this.formItem.orders, 'Orders') == 1)
        ) {
            return;
        } else {
            this._service
                .activation_form_setting_ActionV2(
                    Helper.ProjectID(),
                    this.formItem.id || 0,
                    this.form_id,
                    this.action == 'create.update'
                        ? this.formItem._type_form.key
                        : this.formItem.type_form,
                    this.formItem.survey_id,
                    this.formItem.formula_file,
                    this.formItem._status == true ? 1 : 0,
                    this.formItem.orders,
                    this.action,
                    this.formItem.action
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Form',
                            this.action == 'create.update'
                                ? `Update activation form`
                                : `Delete activation form`,
                            this.action == 'create.update'
                                ? `Update activation form success`
                                : `Delete activation form success`,
                            'success',
                            'SuccessFull'
                        );
                    }
                    this.clearFormAction();
                    this.formDialog = false;
                });
        }
    }
    clearFormAction() {
        this.action = 'create.update';
        this.formItem = {};
        this.getItemForm();
        this.formDialog = false;
    }

    infoActionArr: any = ['step', 'lock_receive_gift', 'final'];

    GetChip(item: any) {
        if (this.formItem.action === null) {
            this.formItem.action = '';
            this.formItem.action = item;
            const data = this.formItem.action.split(',').slice(0, -1);
            const check = item.toString();
            if (data.find((e: any) => e.replace(/ /g, '') === check)) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Double tag',
                });
            } else {
                this.formItem.action = item;
            }
        } else {
            const data = this.formItem.action?.split(',').slice(0, -1);
            const check = item.toString();
            if (data?.find((e: any) => e.replace(/ /g, '') === check)) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Double tag',
                });
            } else {
                if (this.formItem.action === undefined) {
                    this.formItem.action = '';
                    this.formItem.action = item;
                } else if (this.formItem.action === null) {
                    this.formItem.action = '';
                    this.formItem.action = item;
                } else {
                    this.formItem.action = item;
                }
            }
        }
    }

    selectedItemActionArr: any = null;
    selectedInfoAction(event: any) {
        this.selectedItemActionArr = event.value === null ? 0 : event.value;
        this.inputInfoAction = this.selectedItemActionArr;
    }

    onClearType() {
        this.inputInfoAction = [];
        this.infoActionArr = [];
    }
    inputInfoAction: any = [];

    clickProductAction(event: any) {}

    someObject(item: any) {
        try {
            return JSON.parse(item);
        } catch (e) {
            return item;
        }
    }
    checksomeObject(item: any) {
        try {
            let t = JSON.parse(item);
            return 0;
        } catch (e) {
            return 1;
        }
    }
}
