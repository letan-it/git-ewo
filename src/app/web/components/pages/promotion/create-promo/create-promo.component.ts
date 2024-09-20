import {
    Component,
    Input,
    Output,
    OnChanges,
    OnInit,
    SimpleChanges,
    EventEmitter,
    ViewChild,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { PromotionService } from 'src/app/web/service/promotion.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FileService } from 'src/app/web/service/file.service';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { AppComponent } from 'src/app/app.component';
import { SurveyService } from 'src/app/web/service/survey.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';

@Component({
    selector: 'app-create-promo',
    templateUrl: './create-promo.component.html',
    styleUrls: ['./create-promo.component.scss'],
})
export class CreatePromoComponent implements OnChanges {
    @Input() dataOnePromotion!: any;
    @Output() actionEvent = new EventEmitter<string>();

    constructor(
        private messageService: MessageService,
        private _service: PromotionService,
        private taskService: TaskFileService,
        private _file: FileService,
        private _serviceSurvey: SurveyService,
        private edService: EncryptDecryptService,
    ) {}
    image!: string;
    imageFile!: any;
    promotion_id!: number;
    promotion_Code!: any;
    promotion_group!: any;
    promotion_name!: any;
    description!: any;
    status: number = 0;
    desc_image!: string;
    add_product: boolean = false;
    listSurvey: any;
    selectedSurvey: any;
    product_survey_form: any;

    showDescription: boolean = false;
    showDescript() {
        this.showDescription = !this.showDescription;
    }

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

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        translate: 'no',
        placeholder: 'Enter text here...',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',
        sanitize: false,
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
    ngOninit(){
     this.projectName ();   
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.promotion_Code = undefined;
        this.promotion_group = undefined;
        this.promotion_name = undefined;
        this.description = undefined;
        this.status = 0;
        this.add_product = false;
        this.product_survey_form = 0;
        this.desc_image = '';
        if (
            changes['dataOnePromotion'] &&
            this.dataOnePromotion !== undefined
        ) {
            this.dataOnePromotion.forEach((e: any) => {
                this.promotion_Code = e.promotion_code;
                this.promotion_group = e.promotion_group;
                this.promotion_name = e.promotion_name;
                this.description = e.description;
                this.status = e.status;
                (this.desc_image = e.desc_image),
                    (this.promotion_id = e.promotion_id);
                this.add_product = e.add_product == 1 ? true : false;
                this.product_survey_form = e.product_survey_form || 0;
            });
        }

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
        if (this.product_survey_form > 0) {
            this.selectedSurvey = this.listSurvey.filter(
                (item: any) => item.code == this.product_survey_form
            )[0];
        }
    }
    // select data
    selectStatus(e: any) {
        this.status = e.value === null ? 0 : e.value;
    }

    // image

    onChangeImage(e: any, code: any) {
        this.imageFile = e.target.files[0];

        if (
            this.imageFile == undefined ||
            this.NofiImage(
                this.imageFile.name.split('.').pop(),
                'File image'
            ) == 1
        ) {
            this.desc_image = '';
            return;
        } else {
            this.taskService
                .ImageRender(this.imageFile, this.imageFile.name)
                .then((file) => {
                    this.imageFile = file;
                });

            const formUploadImage = new FormData();
            formUploadImage.append('files', this.imageFile);
            formUploadImage.append('ImageType', code);
            formUploadImage.append('WriteLabel', code);

            // this._file.UploadImage(formUploadImage).subscribe((data: any) => {
            //     if (data.result == EnumStatus.ok) {
            //         this.desc_image = EnumSystem.fileLocal + data.data;
            //         // this.inValue.image = EnumSystem.fileLocal + data.data;
            //     }
            // });


            const fileName = AppComponent.generateGuid();
            const newFile = new File([this.imageFile], fileName+this.imageFile.name.substring(this.imageFile.name.lastIndexOf('.')),{type: this.imageFile.type});
            const modun = 'PROMOTION-IMAGE';
            const drawText = code;
            this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                (response : any) => {  
                    this.desc_image = response.url;  
                },
                (error : any) => { 
                    this.desc_image = '';
                }
            );

        }
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

    onImageErrorImage(e: any, type: string) {
        if (type == 'image') {
            this.image = EnumSystem.imageError;
        }
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

    @ViewChild('myInputImage') myInputImage: any;
    clearFileInput() {
        try {
            this.myInputImage.nativeElement.value = null;
        } catch (error) {}
    }

    // create
    create() {
        // promotion_code
        if (this.dataOnePromotion === undefined) {
            if (Helper.IsNull(this.promotion_Code) == true) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Please enter a promotion code',
                });
                return;
            }
            if (Pf.checkLengthCode(this.promotion_Code) != true) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Character length of promotion code must be greater than or equal to 8',
                });
                return;
            }
            if (Pf.checkSpaceCode(this.promotion_Code) == true) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Promotion code must not contain empty characters',
                });

                return;
            }
            if (Pf.checkUnsignedCode(this.promotion_Code) == true) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Promotion code is not allowed to enter accented characters',
                });

                return;
            }
            if (Pf.CheckAccentedCharacters(this.promotion_Code) == true) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Promotion code is not allowed to enter accented characters',
                });

                return;
            }
            if (Helper.IsNull(this.promotion_name)) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Please enter a promotion name',
                });
                return;
            }

            if (
                this.add_product == true &&
                Helper.IsNull(this.selectedSurvey)
            ) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Please select survey form',
                });
                return;
            } else {
                this.product_survey_form =
                    (this.selectedSurvey && this.selectedSurvey.code) || 0;
            }
            // status
            if (Helper.IsNull(this.status)) {
                this.status = 0;
            }
            this._service
                .Promotion_GetList(
                    Helper.ProjectID(),
                    '',
                    '',
                    '',
                    -1,
                    -1,
                    -1,
                    100000,
                    1
                )
                .subscribe((data: any) => {
                    const result = data.data.filter(
                        (x: any) =>
                            x.promotion_code.toUpperCase() ==
                            this.promotion_Code.toUpperCase()
                    );

                    if (result && result.length > 0) {
                        this.messageService.add({
                            severity: EnumStatus.warning,
                            summary: EnumSystem.Notification,
                            detail: 'Promotion code already exist',
                        });
                    } else {
                        // create
                        this._service
                            .Promotion_Action(
                                Helper.ProjectID(),
                                0,
                                this.promotion_Code,
                                this.promotion_group,
                                this.promotion_name,
                                this.description,
                                this.desc_image,
                                this.status,
                                this.add_product == true ? 1 : 0,
                                this.product_survey_form,
                                'create'
                            )
                            .subscribe((res: any) => {
                                if (res.result === EnumStatus.ok) {
                                    this.clearFileInput();
                                    this.actionEvent.emit();
                                }
                            });
                    }
                });
        } else {
            if (Helper.IsNull(this.promotion_name)) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Please enter a promotion name',
                });
                return;
            }

            if (
                this.add_product == true &&
                Helper.IsNull(this.selectedSurvey)
            ) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Please select survey form',
                });
                return;
            } else {
                this.product_survey_form =
                    (this.selectedSurvey && this.selectedSurvey.code) || 0;
            }
            // if (this.imageFile == undefined ||
            //   this.NofiImage(this.imageFile.name.split('.').pop(), 'File image') == 1) {
            //   this.desc_image = '';
            //   return;
            // }
            this._service
                .Promotion_Action(
                    Helper.ProjectID(),
                    this.promotion_id,
                    this.promotion_Code,
                    this.promotion_group,
                    this.promotion_name,
                    this.description,
                    this.desc_image,
                    this.status,
                    this.add_product == true ? 1 : 0,
                    this.product_survey_form,
                    'update'
                )
                .subscribe((res: any) => {
                    if (res.result === EnumStatus.ok) {
                        this.NofiResult(
                            'Page Promotion Shop',
                            'Update Promotion',
                            `Success update Promotion ${this.promotion_Code} - ${this.promotion_name} `,
                            'success',
                            'Successful'
                        );
                        this.clearFileInput();
                        this.actionEvent.emit();
                    }
                });
        }
    }
}
