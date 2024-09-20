import { DatePipe } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { ScriptLoaderService } from 'src/app/web/service/ScriptLoaderService.service';
import { FileService } from 'src/app/web/service/file.service';
import { PromotionService } from 'src/app/web/service/promotion.service';
import { SurveyService } from 'src/app/web/service/survey.service';

interface City {
    name: string;
    code: string;
}
interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'app-promotion',
    templateUrl: './promotion.component.html',
    styleUrls: ['./promotion.component.scss'],
    providers: [ConfirmationService, DatePipe, MessageService],
})
export class PromotionComponent {
    @Input() inValue: any;
    @Output() outValue = new EventEmitter<any>();

    // patternDecimal: RegExp = /^\d+(\.\d)?\d*$/;
    // patternDecimal: RegExp = /^\d{1,5}$|(?=^.{1,5}$)^\d+\.\d{0,2}$/;
    patternDecimal: RegExp = /^\d*\.?\d*$/;
    datetime: any;

    responsiveOptions: any;
    buttons: any;
    product_code: any;

    previewProduct: boolean = false;
    deleteImage: boolean = false;
    clickImageSurvey: boolean = false;
    clickImageProduct: boolean = false;

    @ViewChild('myInputImage') myInputImage: any;
    clearFileInput() {
        try {
            this.myInputImage.nativeElement.value = null;
            this.url = null;
        } catch (error) {}
    }
    activeIndex: number = 0;

    constructor(
        private _service: PromotionService,
        private messageService: MessageService,
        private taskService: TaskFileService,
        private _file: FileService,
        private datePipe: DatePipe,
        private confirmationService: ConfirmationService,
        private surveyService: SurveyService,
        private scriptLoaderService: ScriptLoaderService,
        private edService: EncryptDecryptService
    ) {}

    value!: any[];
    selectedValue!: any;

    cols!: Column[];
    selectedColumns!: Column[];
    colSpanGroup: number = 4;
    project:any 
    projectName () {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter(
            (d: any) => d.project_id == Helper.ProjectID()
        )[0];
        console.log(this.project);
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.

        this.loadUser();
        this.projectName ();

        this.responsiveOptions = [
            {
                breakpoint: '1400px',
                numVisible: 3,
                numScroll: 3,
            },
            {
                breakpoint: '1220px',
                numVisible: 2,
                numScroll: 2,
            },
            {
                breakpoint: '1100px',
                numVisible: 1,
                numScroll: 1,
            },
        ];

        this.value = [
            { name: 'Product', code: '1' },
            { name: 'Category', code: '2' },
        ];
        this.selectedValue = { name: 'Category', code: '2' };

        this.cols = [
            { field: 'category_name', header: 'Category Name' },
            { field: 'brand_code', header: 'Brand Code' },
            { field: 'division_code', header: 'Division code' },
            { field: 'market_code', header: 'Market Code' },
        ];

        // this.colSpanGroup = 4
        try {
            this.selectedColumns =
                Helper.IsNull(
                    JSON.parse(localStorage.getItem('selectedColumns') + '')
                ) != true
                    ? JSON.parse(localStorage.getItem('selectedColumns') + '')
                    : [];
            this.colSpanGroup =
                Helper.IsNull(
                    JSON.parse(localStorage.getItem('colSpanGroup') + '')
                ) != true
                    ? JSON.parse(localStorage.getItem('colSpanGroup') + '')
                    : 4;
        } catch (error) {}
        // this.selectedColumns = this.cols;
        this.isCheckNotGdm = this.checkNotGdm(Helper.ProjectID()); 
    }
    isCheckNotGdm : boolean = true;
    checkNotGdm (project_id: any ) : any{
        return (project_id != 23) ? true : false;
    }

    onChangeColumns(event: any) {
        this.colSpanGroup = 4;
        this.colSpanGroup =
            event != null
                ? this.colSpanGroup + event?.value.length
                : this.colSpanGroup;

        localStorage.setItem(
            'selectedColumns',
            JSON.stringify(this.selectedColumns)
        );
        localStorage.setItem('colSpanGroup', JSON.stringify(this.colSpanGroup));
    }

    checkColSpan(value: any): any {}
    onChangeGroup(event: any) {}
    openImageDbClick(image: any, listphoto: any) {
        const changeindex = image._index;
        localStorage.setItem('listphoto', JSON.stringify(listphoto));
        localStorage.setItem('changeindex', JSON.stringify(changeindex));

        this.urlgallery = 'assets/ZoomImage/tool.html';
        document.open(
            <string>this.urlgallery,
            'windowName',
            'height=700,width=900,top=100,left= 539.647'
        );
    }
    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (changes['inValue']) {
        }
    }

    question_name: any = '';
    selectQuestion() {}

    dblclickImage() {
        this.previewProduct = !this.previewProduct;
    }

    CalceldeleteImageDetails(listphotoImage: any) {
        listphotoImage.forEach((element: any) => {
            element.delete = 0;
        });
    }
    imageDelete: any;
    clickImage(image: any, item_data: any, listphotoImage: any) {
        this.imageDelete = image;
        this.deleteImage = !this.deleteImage;
        this.item_data = item_data;
        try {
            listphotoImage.forEach((element: any) => {
                element.delete = 0;
            });

            image.delete = 1;
        } catch (error) {}
        if (item_data == 'PRODUCT') {
            this.clickImageProduct = true;
            this.clickImageSurvey = false;
        } else {
            this.clickImageProduct = false;
            this.clickImageSurvey = true;
        }
    }

    imageUpload: any;
    url: any = '';
    onUploadImge(event: any, item_data : any) {
        this.imageUpload = event.target.files[0];
        if (Helper.IsNull(this.imageUpload) != true) {
            if (
                this.NofiImage(
                    this.imageUpload.name.split('.').pop(),
                    'File image'
                ) == 1
            ) {
                this.clearFileInput();
                return;
            } else {
                let WriteLabel = this.imageUpload.name;
                this.taskService
                    .ImageRender(this.imageUpload, this.imageUpload.name)
                    .then((file) => {
                        this.imageUpload = file;

                        const formUploadImage = new FormData();
                        formUploadImage.append('files', this.imageUpload);
                        formUploadImage.append('ImageType', WriteLabel);
                        formUploadImage.append('WriteLabel', WriteLabel);

                        // this._file
                        //     .UploadImage(formUploadImage)
                        //     .subscribe((data: any) => {
                        //         if (data.result == EnumStatus.ok) {
                        //             this.url = EnumSystem.fileLocal + data.data;
                        //         } else {
                        //             this.url = '';
                        //         }
                        //     });
                        
                            const fileName = AppComponent.generateGuid();
                            const newFile = new File([this.imageUpload], fileName+this.imageUpload.name.substring(this.imageUpload.name.lastIndexOf('.')),{type: this.imageUpload.type});
                            const modun = item_data;
                            const drawText = WriteLabel;
                            this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                                (response : any) => { 
                                    this.url = response.url; 
                                },
                                (error : any) => { 
                                    this.url = '';
                                }
                            );
                    });
            }
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a image upload',
            });
            return;
        }
    }

    user_profile: string = 'current';
    currentUser: any;
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

    checkUserCUS(): any { 
        return this.userProfile.level == 'CUS' ? true : false;
    }

    item: any;
    listphotoImage: any = [];
    item_data: any = 'SURVEY';
    productDialog: boolean = false;
    editDetails(item: any, list: any, item_data: any) {
        this.item = { ...item };
        this.listphotoImage = list;
        this.item_data = item_data;
        this.productDialog = true;
        this.clearEditDetails();
    }
    clearEditDetails() {
        this.question_name = null;
        this.url = null;
        this.imageUpload = null;
    }

    hideDialogQuestion() {
        this.questionDialog = false;
    }

    hideDialog() {
        this.productDialog = false;
    }

    onChangeQuestion(event: any, item: any, checkValue: any) {
        item.value_string = event != null ? event + '' : null;
        if (checkValue == 4) {
            item.value_datetime = this.transformValue(
                item.support_data,
                item.question_type,
                item.typeOf,
                item.value_string
            );
        }
    }

    editDataQuestion1(listQuestionEdit: any) {
        const result = [] as any;
        // 139/140/141  ???
        // 129 130 4943 134 135 136 137 138 161 162

        listQuestionEdit
            .filter((x: any) => x.id != 139 && x.id != 140 && x.id != 141)
            .forEach((element: any) => {
                const checkType = this.checkValue(
                    element.support_data,
                    element.question_type,
                    element.typeOf
                );

                if (
                    checkType == 8 &&
                    Helper.IsNull(element.value_string) != true &&
                    element.value_string.length > 0
                ) {
                    element.value_string.forEach((v: any) => {
                        result.push({
                            question_id: this.getValue(element.question_id),
                            question_name: this.getValue(element.question_name),
                            value_int: this.getValue(v.answer_id),
                            value_string: this.getValue(v.value),
                            value_decimal: this.getValue(element.value_decimal),
                            value_datetime: this.getValue(
                                element.value_datetime
                            ),
                            typeOf: this.getValue(element.typeOf),
                            note: this.getValue(element.note),
                        });
                    });
                    // }
                    // else if (checkType == 9 || checkType == 10 || checkType == 11) {
                    //   console.log('element  T/Q/X: ', element)
                } else {
                    result.push({
                        // id: Helper.IsNull(element.id) != true ? element.id : 0,
                        // pr_item_id: element.pr_item_id,
                        // pr_id: element.pr_id,

                        question_id: this.getValue(element.question_id),
                        question_name: this.getValue(element.question_name),
                        value_int: this.getValue(element.value_int),
                        value_string: this.getValue(element.value_string),
                        value_decimal: this.getValue(element.value_decimal),
                        value_datetime: this.getValue(element.value_datetime),
                        typeOf: this.getValue(element.typeOf),
                        note: this.getValue(element.note),
                    });
                }
            });

        // ?report_id
        if (result && result.length > 0) {
            this._service
                .Promotion_result_detail_Update(
                    listQuestionEdit.pr_id,
                    listQuestionEdit.pr_item_id,
                    result
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Work',
                            'Update Question',
                            'Update Successful Questions',
                            'success',
                            'SuccessFull'
                        );
                        this.outValue.emit(this.tab.report_id);
                        this.clearDataQuestion();
                    } else {
                        this.NofiResult(
                            'Page Work',
                            'Update Question',
                            'Update Error Questions',
                            'error',
                            'Error'
                        );
                        this.clearDataQuestion();
                    }
                });
        } else {
            this.Nofi('warn', 'Warning', 'There is no question to edit');
        }
    }

    editDataQuestion(listQuestionEdit: any) {
        const result = [] as any;
        // 139/140/141  ???
        // 129 130 4943 134 135 136 137 138 161 162

        listQuestionEdit
            .filter((x: any) => x.id != 139 && x.id != 140 && x.id != 141)
            .forEach((element: any) => {
                const checkType = this.checkValue(
                    element.support_data,
                    element.question_type,
                    element.typeOf
                );
                result.push({
                    id: Helper.IsNull(element.id) != true ? element.id : 0,
                    pr_item_id: element.pr_item_id,
                    pr_id: element.pr_id,
                    question_id: element.question_id,
                    question_name: element.question_name,
                    value_int: element.value_int,
                    value_string:
                        checkType != 8
                            ? element.value_string
                            : element._listAnswer,
                    value_decimal: element.value_decimal,
                    value_datetime: element.value_datetime,
                    typeOf: element.typeOf,
                    note: element.note,
                });
            });

        // ?report_id
        if (result && result.length > 0) {
            this._service
                .Promotion_result_UpdateQuestion(
                    Helper.ProjectID(),
                    this.tab.year_month,
                    result
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Work',
                            'Update Question',
                            'Update Successful Questions',
                            'success',
                            'SuccessFull'
                        );
                        this.outValue.emit(this.tab.report_id);
                        this.clearDataQuestion();
                    } else {
                        this.NofiResult(
                            'Page Work',
                            'Update Question',
                            'Update Error Questions',
                            'error',
                            'Error'
                        );
                        this.clearDataQuestion();
                    }
                });
        } else {
            this.Nofi('warn', 'Warning', 'There is no question to edit');
        }
    }

    addImageDetails() {
        // this.onUploadImge(event);

        if (
            this.NofiIsNull(this.question_name, 'question name') == 1 ||
            this.NofiIsNull(this.imageUpload, 'image upload') == 1 ||
            this.NofiIsNull(this.url, 'image upload') == 1
        ) {
            return;
        } else {
            this._service
                .Promotion_result_detail_file_Action(
                    Helper.ProjectID(),
                    0,
                    this.item.pr_item_id,
                    this.item.pr_id,
                    this.question_name.question_id,
                    this.question_name.question_name,
                    this.url,
                    'create'
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        var today = new Date();
                        var date =
                            today.getFullYear() +
                            '-' +
                            (today.getMonth() + 1) +
                            '-' +
                            today.getDate();
                        var time =
                            today.getHours() +
                            ':' +
                            today.getMinutes() +
                            ':' +
                            today.getSeconds();
                        var dateTime = date + ' ' + time;

                        this.inValue.data_promotion.result.forEach(
                            (data: any) => {
                                if (
                                    this.item_data == 'PRODUCT' &&
                                    data.pr_id == this.item.pr_id
                                ) {
                                    const i =
                                        data.image.product.listphotoImage
                                            .length;
                                    data.image.product.listphotoImage.push({
                                        id: i + 1,
                                        _id: 0, // List ?
                                        pr_item_id: this.item.pr_item_id,
                                        pr_id: this.item.pr_id,
                                        question_id:
                                            this.question_name.question_id,
                                        src: this.url,
                                        title: `${this.question_name.question_name}`,
                                        question_name:
                                            this.question_name.question_name,
                                        product: `${this.item.product_code} - ${this.item.product_name}`,
                                        image_time: dateTime,
                                        _index: i + 1,
                                    });
                                } else if (
                                    this.item_data == 'SURVEY' &&
                                    data.pr_id == this.item.pr_id
                                ) {
                                    const i =
                                        data.image.survey.listphotoImage.length;
                                    data.image.survey.listphotoImage.push({
                                        id: i + 1,
                                        _id: 0, // List ?
                                        pr_item_id: this.item.pr_item_id,
                                        pr_id: this.item.pr_id,
                                        question_id:
                                            this.question_name.question_id,
                                        src: this.url,
                                        title: `${this.question_name.question_name}`,
                                        question_name:
                                            this.question_name.question_name,
                                        survey: this.item.survey_name,
                                        image_time: dateTime,
                                        _index: i + 1,
                                    });
                                }
                            }
                        );

                        this.NofiResult(
                            `Page Work`,
                            `More photos`,
                            this.item_data == `PRODUCT`
                                ? `Add successful images for question ${this.question_name.question_name} of a product with a code of ${this.item.product_code}`
                                : `Add successful images for question ${this.question_name.question_name} of a survey with a name of ${this.item.survey_name}`,
                            `success`,
                            `Successfull`
                        );

                        this.clear();
                    } else {
                        this.clear();
                    }
                });
        }
    }

    clear() {
        this.productDialog = false;
        this.deleteImage = false;
        this.question_name = null;
        this.clearFileInput();
    }

    confirm1(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmed',
                    detail: 'You have accepted',
                    life: 3000,
                });
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

    deleteImageDetails(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteImageAccept();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                });
            },
        });
    }

    deleteImageAccept() {
        this._service
            .Promotion_result_detail_file_Action(
                Helper.ProjectID(),
                this.imageDelete._id,
                this.imageDelete.pr_item_id,
                this.imageDelete.pr_id,
                this.imageDelete.question_id,
                this.imageDelete.question_name,
                this.imageDelete.src,
                'delete'
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.NofiResult(
                        `Page Works`,
                        `Delete images`,
                        this.item_data == `PRODUCT`
                            ? `Successfully deleting the image of question ${this.imageDelete.question_name} of the product ${this.imageDelete.product}`
                            : `Successfully deleting the image of question ${this.imageDelete.question_name} of the survey ${this.imageDelete.survey}`,
                        `success`,
                        `Successfull`
                    );

                    this.inValue.data_promotion.result.forEach((data: any) => {
                        this.item_data == `PRODUCT` &&
                        data.pr_id == this.imageDelete.pr_id
                            ? (data.image.product.listphotoImage =
                                  data.image.product.listphotoImage.filter(
                                      (x: any) => x._id != this.imageDelete._id
                                  ))
                            : (data.image.survey.listphotoImage =
                                  data.image.survey.listphotoImage.filter(
                                      (x: any) => x._id != this.imageDelete._id
                                  ));
                    });

                    this.clear();
                } else {
                    this.clear();
                }
            });
    }
    getPromotion(value: any): any {
        switch (value) {
            case 'Đạt':
                return 'success';
            case 'Rớt':
                return 'danger';
            default:
                return 'warning';
        }
    }

    editItem(item: any) {}

    selectAll = false;
    onSelectAllChange(event: any) {
        this.selectAll = event.checked;
    }

    onRowEditInit(item: any, list: any) {
        // if (this.checkValue(item.support_data, item.question_type, item.typeOf) == 8) {
        //   this.chooseMultiSelect(item.value_string, item)
        // }
    }

    stateOptions: any = [];

    checkNote(support_data: any, question_type: any, typeOf: any): any {
        const checkValue = this.checkValue(support_data, question_type, typeOf);
        let result = 0;
        if (checkValue != 9 && checkValue != 10 && checkValue != 11) {
            result = 1;
        } else if (checkValue == 9) {
            result = 2;
        } else if (checkValue == 10) {
            result = 3;
        } else {
            result = 4;
        }
        return result;
    }
    checkValue(support_data: any, question_type: any, typeOf: any): any {
        if (
            support_data == 'int' &&
            question_type == 'number' &&
            typeOf == 'int'
        ) {
            // int	number	int
            return 2;
        } else if (
            support_data == 'decimal' &&
            question_type == 'number' &&
            typeOf == 'decimal'
        ) {
            //decimal	number	decimal
            return 3;
        } else if (
            support_data == 'date' &&
            question_type == 'text' &&
            typeOf == 'string'
        ) {
            //date	text	string
            return 4;
        } else if (
            support_data == 'datetime' &&
            question_type == 'text' &&
            typeOf == 'string'
        ) {
            return 5;
        } else if (
            (support_data == 'Yes-No' || support_data == 'Right-Wrong') &&
            question_type == 'check' &&
            typeOf == 'int'
        ) {
            if (support_data == 'Yes-No') {
                this.stateOptions = [
                    { label: 'Có', value: 'Có', value_int: 1 },
                    { label: 'Không', value: 'Không', value_int: 0 },
                ];
            } else {
                this.stateOptions = [
                    { label: 'Đúng', value: 'Đúng', value_int: 1 },
                    { label: 'Sai', value: 'Sai', value_int: 0 },
                ];
            }
            return 6;
        } else if (
            support_data == null &&
            question_type == 'select' &&
            typeOf == 'int'
        ) {
            return 7;
        } else if (
            support_data == null &&
            question_type == 'multi-select' &&
            typeOf == 'int'
        ) {
            return 8;
        } else if (
            support_data == 'Provinces' &&
            question_type == 'text' &&
            typeOf == 'int'
        ) {
            return 9;
        } else if (
            support_data == 'Districts' &&
            question_type == 'text' &&
            typeOf == 'int'
        ) {
            return 10;
        } else if (
            support_data == 'Wards' &&
            question_type == 'text' &&
            typeOf == 'int'
        ) {
            return 11;
        } else if (
            support_data == null &&
            question_type == 'final' &&
            typeOf == 'int'
        ) {
            return 12;
        } else if (
            support_data == null &&
            question_type == 'image' &&
            typeOf == 'string'
        ) {
            return 13;
        } else if (
            support_data == 'string' &&
            question_type == 'qr' &&
            typeOf == 'string'
        ) {
            return 14;
        } else {
            return 1;
        }
    }

    checkValueInt(
        support_data: any,
        question_type: any,
        typeOf: any,
        value_int: any,
        value_string: any
    ): any {
        const checkValue = this.checkValue(support_data, question_type, typeOf);
        //return (checkValue == 1 || checkValue == 3 || checkValue == 4 || checkValue == 5) ? null : value_int
        if (
            checkValue == 1 ||
            checkValue == 3 ||
            checkValue == 4 ||
            checkValue == 5
        ) {
            return null;
        } else if (checkValue == 2) {
            return parseInt(value_string);
        } else {
            return value_int;
        }
    }
    chooseSelectButton(event: any, item: any) {
        item.value_int = event.option.value_int;
    }
    chooseSelect(event: any, item: any) {
        item.value_int = event != null ? event?.value?.answer_id : null;
        item.value_string = event != null ? event?.value?.value : null;
    }

    tabDetailsData: any = [];
    actionLocation(event: any, item: any, key: any) {
        this.inValue.data_promotion.result.forEach((l: any) => {
            if (item.item_data == 'SURVEY') {
                this.tabDetailsData =
                    Helper.IsNull(l.detail.survey) != true
                        ? l.detail.survey
                        : [];
            } else {
                this.tabDetailsData =
                    Helper.IsNull(l.detail.product) != true
                        ? l.detail.product
                        : [];
            }
        });

        const ListLocation = this.tabDetailsData?.filter(
            (s: any) =>
                (s.support_data == 'Provinces' ||
                    s.support_data == 'Districts' ||
                    s.support_data == 'Wards') &&
                s.question_type == 'text' &&
                s.typeOf == 'int'
        );

        const result = ListLocation.filter(
            (x: any) =>
                x.pr_item_id == item.pr_item_id &&
                x.pr_id == item.pr_id &&
                x.item_data == item.item_data &&
                x.data_form_survey == item.data_form_survey &&
                x.product_id == item.product_id
        );

        if (key == 1) {
            result.forEach((y: any) => {
                y.item_Province = event != null ? event : null;
                y._idProvince = item.id;
                y.item_District = null;
                y.item_Ward = null;
                y._noteProvince = item._noteProvince;
                item.value_string = event?.name;
            });
        } else if (key == 2) {
            result.forEach((y: any) => {
                y.item_District = event != null ? event : null;
                y._idDistrict = item.id;
                y.item_Ward = null;
                y._noteDistrict = item._noteDistrict;
                item.value_string = event?.name;
            });
        } else {
            result.forEach((y: any) => {
                y.item_Ward = event != null ? event : null;
                y._idWard = item.id;
                y._noteWard = item._noteWard;
                item.value_string = event?.name;
            });
        }
    }

    // , tab: any
    actionNote(event: any, item: any) {
        this.inValue.data_promotion.result.forEach((l: any) => {
            if (item.item_data == 'SURVEY') {
                this.tabDetailsData =
                    Helper.IsNull(l.detail.survey) != true
                        ? l.detail.survey
                        : [];
            } else {
                this.tabDetailsData =
                    Helper.IsNull(l.detail.product) != true
                        ? l.detail.product
                        : [];
            }
        });

        const ListLocation = this.tabDetailsData?.filter(
            (s: any) =>
                (s.support_data == 'Provinces' ||
                    s.support_data == 'Districts' ||
                    s.support_data == 'Wards') &&
                s.question_type == 'text' &&
                s.typeOf == 'int'
        );

        const result = ListLocation.filter(
            (x: any) =>
                x.pr_item_id == item.pr_item_id &&
                x.pr_id == item.pr_id &&
                x.item_data == item.item_data &&
                x.data_form_survey == item.data_form_survey &&
                x.product_id == item.product_id
        );

        result.forEach((y: any) => {
            if (item.support_data == 'Provinces') {
                y._noteProvince = event;
            } else if (item.support_data == 'Districts') {
                y._noteDistrict = event;
            } else if (item.support_data == 'Wards') {
                y._noteWard = event;
            }
        });
    }

    // , tab: any
    item_Province: any = null;
    selectProvince(event: any, item: any) {
        item.keyUpdateProvince = event != null ? 1 : 0;
        this.actionLocation(event, item, 1);
    }

    item_District: any = null;
    selectDistrict(event: any, item: any) {
        item.keyUpdateDistrict = event != null ? 1 : 0;
        this.actionLocation(event, item, 2);
    }

    item_Ward: any = null;
    selectWard(event: any, item: any) {
        item.keyUpdateWard = event != null ? 1 : 0;
        this.actionLocation(event, item, 3);
    }

    // tab: any,
    chanegesNoteProvince(event: any, item: any) {
        this.actionNote(event, item);
    }
    chanegesNoteDistrict(event: any, item: any) {
        this.actionNote(event, item);
    }
    chanegesNoteWard(event: any, item: any) {
        this.actionNote(event, item);
    }

    transformValue(
        support_data: any,
        question_type: any,
        typeOf: any,
        value_string: any
    ): any {
        // support_data, question_type, typeOf

        if (
            support_data == 'date' &&
            question_type == 'text' &&
            typeOf == 'string'
        ) {
            return this.datePipe.transform(
                new Date(value_string),
                'yyyy-MM-dd'
            );
        } else if (
            support_data == 'datetime' &&
            question_type == 'text' &&
            typeOf == 'string'
        ) {
            return this.datePipe.transform(
                new Date(value_string),
                'yyyy-MM-dd HH:mm:ss'
            );
        } else {
            return value_string;
        }
    }

    chooseMultiSelect(event: any, item: any) {
        this.actionListAnswer(event.value, item);
    }

    actionListAnswer(list: any, item: any) {
        item._listAnswer = '';
        item.value_string_info = '';
        list?.forEach((element: any) => {
            if (Helper.IsNull(element.answer_id) != true) {
                item._listAnswer += `${element.answer_id},`;
                item.value_string_info += `${element.value},`;
            }
        });
    }

    onRowEditSave(item: any, tab: any) {
        const checkType = this.checkValue(
            item.support_data,
            item.question_type,
            item.typeOf
        );
        if (
            (checkType != 8 &&
                this.NofiIsNull(item.value_string, 'value') == 1) ||
            (checkType == 3 &&
                this.NofiDecimal(item.value_string, 'Value') == 1) ||
            (checkType == 2 &&
                this.checkNumber(parseInt(item.value_string), 'Value') == 1)
        ) {
            return;
        } else {
            if (checkType == 8 && Helper.IsNull(item.value_string) == true) {
                item._listAnswer = `0,`;
            } else if (
                checkType == 8 &&
                Helper.IsNull(item.value_string) != true
            ) {
                this.actionListAnswer(item.value_string, item);
            } else {
                item.value_string =
                    checkType == 2 || checkType == 3
                        ? item.value_string + ``
                        : item.value_string;
            }

            item.value_int = this.checkValueInt(
                item.support_data,
                item.question_type,
                item.typeOf,
                item.value_int,
                item.value_string
            );
            item.value_string = this.transformValue(
                item.support_data,
                item.question_type,
                item.typeOf,
                item.value_string
            );

            if (checkType == 9 || checkType == 10 || checkType == 11) {
                if (
                    this.NofiIsNull(item.item_Province, 'province') == 1 ||
                    this.NofiIsNull(item.item_District, 'district') == 1 ||
                    this.NofiIsNull(item.item_Ward, 'ward') == 1
                ) {
                    return;
                } else {
                    this.updateDetailsLocation(
                        checkType,
                        tab,
                        item,
                        item._idProvince,
                        item.item_Province,
                        item._noteProvince
                    );
                    this.updateDetailsLocation(
                        checkType,
                        tab,
                        item,
                        item._idDistrict,
                        item.item_District,
                        item._noteDistrict
                    );
                    this.updateDetailsLocation(
                        checkType,
                        tab,
                        item,
                        item._idWard,
                        item.item_Ward,
                        item._noteWard
                    );
                }
            } else if (checkType != 9 && checkType != 10 && checkType != 11) {
                this.updateDetails(checkType, tab, item);
            }
        }
    }
    updateDetailsLocation(
        checkType: any,
        tab: any,
        item: any,
        id: any,
        value: any,
        note: any
    ) {
        item.id = id;
        item.value_int = value.code;
        item.value_string = value.name;
        item.note = note;
        this.updateDetails(checkType, tab, item);
    }

    updateDetails(checkType: any, tab: any, item: any) {
        this._service
            .Promotion_result_detail_Action(
                Helper.ProjectID(),
                item.id,
                item.value_int,
                checkType != 8 ? item.value_string : item._listAnswer,
                item.note
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    data.data?.forEach((x: any) => {
                        if (Helper.IsNull(x.history) != true) {
                            x.history = JSON?.parse(x.history);
                        } else {
                            x.history = null;
                        }
                    });

                    const element = data.data[0];
                    item.history = element.history ? element.history : [];

                    if (checkType != 9 && checkType != 10 && checkType != 11) {
                        this.NofiResult(
                            `Page Works`,
                            `Edit question information`,
                            `Successfully editing information of question ${
                                item.question_name
                            } 
            (Value : ${this.transformValue(
                item.support_data,
                item.question_type,
                item.typeOf,
                checkType != 8
                    ? `${item.value_string} ,`
                    : item.value_string_info
            )} Note : ${item.note})`,
                            `success`,
                            `Successfull`
                        );
                    } else {
                        this.NofiResult(
                            `Page Works`,
                            `Edit question information`,
                            `Successful update of information province - district - ward `,
                            `success`,
                            `Successfull`
                        );
                    }
                    if (checkType == 8) {
                        this.outValue.emit(tab.report_id);
                    }
                    this.callCalculatorResult(tab);
                } else {
                    this.messageService.add({
                        severity: `error`,
                        summary: `Error`,
                        detail: `Edit question information ${item.question_name}( ${data.message} )`,
                        life: 3000,
                    });
                }
            });
    }

    callCalculatorResult(tab: any) {
        if (Helper.IsNull(tab.formula_file_js) != true) {
            this._service
                .Promotion_result_detail_JsonResult(
                    Helper.ProjectID(),
                    tab.pr_id
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        try {
                            const jsonResult = data.data[0].dataJson;
                            this.scriptLoader(
                                tab.formula_file_js,
                                jsonResult,
                                tab
                            );
                            // this.outValue.emit(tab.report_id); // LoadData
                        } catch (error) {
                            console.log('Error :', error);
                        }
                    }
                });
        } else {
            // this.Nofi('warn', 'Warning', 'There is no question to edit')
        }
    }

    callCalculatorFunction(value: any, tab: any): void {
        // Assuming jsonResult is defined within the scope of this component
        try {
            const jsonResult = value;
            var data = (window as any).calculator(jsonResult);

            const dataJson =
                Helper.IsNull(data) != null ? JSON.parse(data) : null;
            if (Helper.IsNull(dataJson) != true) {
                const result = dataJson.result;
                const result_note = dataJson.note;

                if (
                    Helper.IsNull(data) != null &&
                    (result == 1 || result == 0) &&
                    Helper.IsNull(result_note) != true
                ) {
                    this._service
                        .Promotion_result_UpdateResult(
                            Helper.ProjectID(),
                            tab.pr_id,
                            result,
                            result_note,
                            data
                        )
                        .subscribe((data: any) => {
                            if (data.result == EnumStatus.ok) {
                                // this.outValue.emit(tab.report_id);
                                tab.tagResult = result == 1 ? 'Đạt' : 'Rớt';
                                this.Nofi(
                                    'success',
                                    'SuccessFull',
                                    `Successful update results (${tab.tagResult}) of the promotion report`
                                );
                            }
                        });
                } else {
                    return;
                }
            } else {
                return;
            }
        } catch (error) {
            console.error('Error Call Calculator Function :', error);
        }
    }

    scriptLoader(scriptUrl: any, jsonResult: any, tab: any) {
        // const scriptUrl = 'https://audit.acacy.com.vn:1000/js/promotion_70_caculator.js';
        this.scriptLoaderService
            .loadScript(scriptUrl)
            .then(() => {
                // Script has been loaded, you can now call the calculator function
                this.callCalculatorFunction(jsonResult, tab);
            })
            .catch((error) => {
                // Handle any errors that occurred during script loading
                console.error('Error loading script:', error);
            });
    }

    onRowEditCancel(item: any, index: number) {
        // this.products[index] = this.clonedProducts[product.id as string];
        // delete this.clonedProducts[product.id as string];
    }
    // Survey_question_FormEdit
    questionDialog: boolean = false;
    listQuestionEdit: any = [];
    itemData: any = null;
    tabdetails: any = [];
    tab: any = [];

    getData(list: any, question_id: any) {
        const data = list.filter((x: any) => x.question_id == question_id);
        return data.length > 0 ? data[0] : null;
    }
    getValue(value: any): any {
        return Helper.IsNull(value) != true ? value : null;
    }

    editQuestion(item: any, tab: any, tabdetails: any, item_data: any) {
        item.headerName =
            item_data == 'PRODUCT'
                ? `PRODUCT : ${item.product_code} - ${item.product_name}`
                : `SURVEY : ${item.survey_name}`;

        this.surveyService
            .Survey_question_FormEdit(item.data_form_survey)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listQuestionEdit = data.data;
                    const dataTab = tabdetails.filter(
                        (x: any) => x.product_id == item.product_id
                    );

                    this.listQuestionEdit.forEach((element: any) => {
                        try {
                            this.listQuestionEdit.pr_item_id = this.getData(
                                dataTab,
                                element.question_id
                            ).pr_item_id;
                            this.listQuestionEdit.pr_id = this.getData(
                                dataTab,
                                element.question_id
                            ).pr_id;

                            // element.id = Helper.IsNull(this.getData(dataTab, element.question_id).id) != true ? this.getData(dataTab, element.question_id).id : 0
                            element.pr_item_id = this.getData(
                                dataTab,
                                element.question_id
                            ).pr_item_id;
                            element.pr_id = this.getData(
                                dataTab,
                                element.question_id
                            ).pr_id;
                            element.item_data = this.getData(
                                dataTab,
                                element.question_id
                            ).item_data;
                            element.data_form_survey = this.getData(
                                dataTab,
                                element.question_id
                            ).data_form_survey;
                            element.product_id = this.getData(
                                dataTab,
                                element.question_id
                            ).product_id;

                            element.answer = JSON.parse(element.answer);
                            element.value_datetime = this.getData(
                                dataTab,
                                element.question_id
                            ).value_datetime;
                            element.value_decimal = this.getData(
                                dataTab,
                                element.question_id
                            ).value_decimal;
                            element.value_int = this.getData(
                                dataTab,
                                element.question_id
                            ).value_int;
                            element.value_string = this.getData(
                                dataTab,
                                element.question_id
                            ).value_string;
                            element.note = this.getData(
                                dataTab,
                                element.question_id
                            ).note;
                            element.answer_option = this.getData(
                                dataTab,
                                element.question_id
                            ).answer_option;
                            element._value_string = this.getData(
                                dataTab,
                                element.question_id
                            )._value_string;
                            element._listAnswer = this.getData(
                                dataTab,
                                element.question_id
                            )._listAnswer;

                            element.item_Province = this.getData(
                                dataTab,
                                element.question_id
                            ).item_Province;
                            element.item_District = this.getData(
                                dataTab,
                                element.question_id
                            ).item_District;
                            element.item_Ward = this.getData(
                                dataTab,
                                element.question_id
                            ).item_Ward;

                            element._noteProvince = this.getData(
                                dataTab,
                                element.question_id
                            )._noteProvince;
                            element._noteDistrict = this.getData(
                                dataTab,
                                element.question_id
                            )._noteDistrict;
                            element._noteWard = this.getData(
                                dataTab,
                                element.question_id
                            )._noteWard;
                        } catch (error) {}
                    });

                    this.itemData = item;
                    this.tab = tab;
                    this.tabdetails = tabdetails;
                    this.questionDialog = true;
                } else {
                    this.listQuestionEdit = [];
                }
            });
    }

    clearDataQuestion() {
        this.questionDialog = false;
        this.listQuestionEdit = [];
        this.itemData = null;
        this.tabdetails = [];
        this.tab = [];
    }
    calculateCustomerTotal(name: string, list: any) {
        let total = 0;

        if (list) {
            for (let customer of list) {
                if (customer.representative?.name === name) {
                    total++;
                }
            }
        }
        return total;
    }

    urlgallery: any;
    showImageProduct(url: any) {
        this.urlgallery = url;
        document.open(
            <string>this.urlgallery,
            'windowName',
            'height=700,width=900,top=100,left= 539.647'
        );
    }

    Nofi(severity: any, summary: any, name: any) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: name,
        });
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

    NofiDecimal(value: any, name: any): any {
        let check = 0;
        if (Pf.checkDecimal(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            check = 1;
        }
        return check;
    }

    checkNumber(value: any, name: any): any {
        if (Helper.number(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            return 1;
        }
        return 0;
    }

    NofiDecimal1(value: any, name: any): any {
        let check = 0;
        if (Pf.checkDecimal(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            check = 1;
        }
        return check;
    }

    NofiIsNull(value: any, name: any): any {
        let check = 0;
        if (value == 0) {
            value += '';
        }
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
    IsNull(value: any): any {
        return Helper.IsNull(value);
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

    checkNotExists(list: any): any {
        return list && list.length == 0 ? true : false;
    }

    getDistinctObjects(dataList: any, property: any) {
        const uniqueValues = new Set();
        this.sortedArray(dataList);

        return dataList.filter((obj: any) => {
            const value = obj[property];
            if (!uniqueValues.has(value)) {
                uniqueValues.add(value);
                return true;
            }
            return false;
        });
    }

    sortedArray(list: any): any {
        list.sort((n1: any, n2: any) => {
            if (n1.value > n2.value) {
                return 1;
            }
            if (n1.value < n2.value) {
                return -1;
            }
            return 0;
        });
    }

    getSeverity(status: string): any {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warning';

            case 'renewal':
                return null;
        }
    }
}
