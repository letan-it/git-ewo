import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    ViewChild,
    Output,
    EventEmitter,
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
    selector: 'app-detail-promo',
    templateUrl: './detail-promo.component.html',
    styleUrls: ['./detail-promo.component.scss'],
    providers: [ConfirmationService, MessageService],
})
export class DetailPromoComponent implements OnInit, OnChanges {
    @Input() data: any;
    @Output() outValue = new EventEmitter<any>();

    constructor(
        private _service: PromotionService,
        private _serviceSurvey: SurveyService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private taskService: TaskFileService,
        private edService: EncryptDecryptService,
        private _file: FileService
    ) {}

    tap: number = 0;

    promotion_id!: number;
    promotion_Code!: any;
    promotion_group!: any;
    promotion_name!: any;
    description!: any;
    formula_file_js!: any;
    survey!: number;
    status!: any;
    product!: number;
    desc_image!: any;
    create_name!: any;
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
    selectedSurvey: any;
    listSurvey: any;
    showUpdate: boolean = false;
    buttons!: any[];

    product_survey_form: any;

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
            this.promotion_id = this.data.promotion_id;
            this.promotion_Code = this.data.promotion_code;
            this.promotion_group = this.data.promotion_group;
            this.promotion_name = this.data.promotion_name;
            this.description = this.data.description;
            this.formula_file_js = this.data.formula_file_js;
            this.survey = this.data.survey;
            this.status = this.data.status === 1 ? true : false;
            this.product = this.data.product;
            this.desc_image = this.data.desc_image
                ? this.data.desc_image
                : EnumSystem.noImage;
            this.create_name = this.data.create_name;
            this.created_date = this.data.created_date;
            this.update_name = this.data.update_name;
            this.update_date = this.data.update_date;
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
        console.log(this.project);
    }

    ngOnInit(): void {
        this.projectName();
        this.loadUser();
        this.checkActionUser();

        this.cols = [
            // { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            {
                field: 'error_name',
                header: 'Error Name',
                customExportHeader: 'Error Name',
            },
            { field: 'promotion_id', header: 'Promotion Id' },
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
                        status: i.status,
                    }));

                    this.listSurvey.forEach((item: any) => {
                        if (this.data.product_survey_form === item.code) {
                            this.data.status = true;
                        }
                    });
                }
            });
        if (this.product_survey_form > 0) {
            this.selectedSurvey = this.listSurvey.filter(
                (item: any) => item.code == this.product_survey_form
            )[0];
        }

        this.buttons = [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                    if (this.tap == 0) {
                        this.updateProduct();
                    } else {
                        this.updateSurvey();
                    }
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
        this.promotion_id = this.data?.promotion_id;
        this._service
            .Promotion_item_GetList(Helper.ProjectID(), this.data?.promotion_id)
            .subscribe((res: any) => {
                if (res.result == EnumStatus.ok) {
                    res.data = res.data.map((x: any) => ({
                        ...x,
                        tooltip:
                            x.update_by != null
                                ? `Update By : [${x.update_by}] - ${x.update_code} - ${x.update_name} Time : ${x.update_date}`
                                : null,
                    }));
                    this.dataProduct = res.data.filter(
                        (e: any) =>
                            (e.item_data == 'PRODUCT' && e.survey_type === 1) ||
                            e.survey_type === 2
                    );
                    this.dataSurvey = res.data.filter(
                        (e: any) =>
                            (e.item_data == 'SURVEY' && e.survey_type === 1) ||
                            e.survey_type === 2
                    );
                }
            });
    }

    showDescription: boolean = false;
    showDescript() {
        this.showDescription = !this.showDescription;
    }

    actionSubmit(): void {
        if (this.NofiIsNull(this.selectedSurvey, 'survey') == 1) {
            return;
        }

        if (this.mindata == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Min not is 0',
            });
            return;
        }
        if (Helper.IsNull(this.maxdata) == true) {
            this.maxdata = null;
        }
        if (
            this.checkMinMax(this.mindata, this.maxdata) == 1 ||
            this.checkNumber(this.mindata, 'Min data') == 1 ||
            (this.tap === 0 &&
                this.checkNumber(this.product_target, 'Product target') == 1)
        ) {
            return;
        }
        if (this.tap === 0) {
            this.handleActionProduct('create');
        } else {
            this.handleActionSurvey('create');
        }
    }

    checkNumber(value: any, name: any): any {
        if (Helper.number(value) != true && Helper.IsNull(value) != true) {
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
        console.log(
            '🚀handleActionProduct ~ action:',
            this.mindata,
            this.maxdata,
            this.product_target
        );

        this._service
            .Promotion_item_product_Action(
                Helper.ProjectID(),
                this.promotion_id,
                this.selectedSurvey?.code ? this.selectedSurvey?.code : 0,
                this.inputAction,
                this.mindata,
                this.maxdata,
                this.product_target,
                action
            )
            .subscribe((res: any) => {
                if (res.result == EnumStatus.ok) {
                    this.getData();
                    if (action == 'create') {
                        this.NofiResult(
                            'Page Promotion shop',
                            'Update Promotion_Shop',
                            `Successfully edited Product ${this.inputAction} in item Promotion shop `,
                            'success',
                            'Successfull'
                        );
                        this.clearInputProduct();
                    } else {
                        this.NofiResult(
                            'Page Promotion shop',
                            'Delete Promotion_Shop',
                            `Successfully delete  Product ${this.inputAction} in item Promotion shop `,
                            'success',
                            'Successfull'
                        );
                        this.clearInputProduct();
                    }
                }
            });
    }

    clearInputProduct() {
        this.inputAction = null;
        this.showUpdate = false;
        this.selectedSurvey = null;
        this.mindata = 1;
        this.maxdata = null;
        this.product_target = null;
    }

    handleActionSurvey(action: string) {
        this._service
            .Promotion_item_survey_Action(
                Helper.ProjectID(),
                this.promotion_id,
                this.selectedSurvey?.code ? this.selectedSurvey?.code : 0,
                this.mindata,
                this.maxdata,
                action
            )
            .subscribe((res: any) => {
                if (res.result == EnumStatus.ok) {
                    if (action == 'create') {
                        this.NofiResult(
                            'Page Promotion shop',
                            'Update Promotion_Shop',
                            `Successfully edited ${this.selectedSurvey?.name}  Survey in item Promotion shop `,
                            'success',
                            'Successfull'
                        );
                        this.clearInputSurvey();
                    } else {
                        this.NofiResult(
                            'Page Promotion shop',
                            'Delete Promotion_Shop',
                            `Successfully Delete ${this.selectedSurvey?.name} Survey item Promotion shop `,
                            'success',
                            'Successfull'
                        );
                        this.clearInputSurvey();
                    }

                    this.getData();
                }
            });
    }

    clearInputSurvey() {
        this.showUpdate = false;
        this.selectedSurvey = null;
        this.mindata = 1;
        this.maxdata = null;
    }

    deleteProduct() {
        this.handleActionProduct('delete');
    }
    updateProduct() {
        if (this.NofiIsNull(this.inputAction, 'product') == 1) {
            return;
        }

        this.selectedSurvey = null;
        this.showUpdate = !this.showUpdate;
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
    // action survey
    confirmDelete() {
        if (this.tap == 0) {
            if (this.NofiIsNull(this.inputAction, 'product list') == 1) {
                return;
            }
        } else {
            if (this.NofiIsNull(this.selectedSurvey, 'survey') == 1) {
                return;
            }
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

    updateSurvey() {
        if (this.NofiIsNull(this.selectedSurvey, 'survey') == 1) {
            return;
        }
        this.showUpdate = true;
    }

    deleteSurvey() {
        this.handleActionSurvey('delete');
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

    @ViewChild('myInputFormulaFile') myInputImage: any;
    clearFormulaFile() {
        try {
            this.myInputImage.nativeElement.value = null;
            // this.url = null;
        } catch (error) {}
    }

    fileUpload: any;
    url: any = '';
    onUploadFormulaFile(event: any, promotion_id: any) {
        this.fileUpload = event.target.files[0];
        if (Helper.IsNull(this.fileUpload) != true) {
            if (
                this.NofiFileUpload(
                    this.fileUpload.name.split('.').pop(),
                    'Formula File'
                ) == 1
            ) {
                this.clearFormulaFile();
                this.url = null;
                return;
            } else {
                const formUploadImage = new FormData();
                formUploadImage.append('files', this.fileUpload);
                formUploadImage.append('ImageType', this.fileUpload.name);
                // formUploadImage.append('WriteLabel', WriteLabel);

                // this._file
                //   .UploadFile(formUploadImage)
                //   .subscribe((data: any) => {
                //     if (data.result == EnumStatus.ok) {
                //       this.url = EnumSystem.fileLocal + data.data;

                //       this._service.Promotion_UploadFile(promotion_id, this.url)
                //         .subscribe((data: any) => {
                //           if (data.result == EnumStatus.ok) {
                //             this.formula_file_js = this.url

                //             this.NofiResult('Page Promotion', 'Edit Formula JS file of Promotion', 'Edit the Formula JS file of Promotion Success', 'success', 'SuccessFull');
                //           } else {
                //             this.NofiResult('Page Promotion', 'Edit Formula JS file of Promotion', 'Edit the Formula JS file of Promotion Error', 'error', 'Error');
                //           }
                //           this.clearFormulaFile();
                //         })
                //     } else {
                //       this.url = null;
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
                            this.url = response.url;

                            this._service
                                .Promotion_UploadFile(promotion_id, this.url)
                                .subscribe((data: any) => {
                                    if (data.result == EnumStatus.ok) {
                                        this.formula_file_js = this.url;

                                        this.NofiResult(
                                            'Page Promotion',
                                            'Edit Formula JS file of Promotion',
                                            'Edit the Formula JS file of Promotion Success',
                                            'success',
                                            'SuccessFull'
                                        );
                                    } else {
                                        this.NofiResult(
                                            'Page Promotion',
                                            'Edit Formula JS file of Promotion',
                                            'Edit the Formula JS file of Promotion Error',
                                            'error',
                                            'Error'
                                        );
                                    }
                                    this.clearFormulaFile();
                                });
                        },
                        (error: any) => {
                            this.url = null;
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
        // console.log('this.userProfile ', this.userProfile)
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
}
