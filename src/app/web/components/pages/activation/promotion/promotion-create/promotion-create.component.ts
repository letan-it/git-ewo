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
import { ActivationService } from 'src/app/web/service/activation.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';

@Component({
    selector: 'app-promotion-create',
    templateUrl: './promotion-create.component.html',
    styleUrls: ['./promotion-create.component.scss'],
})
export class PromotionCreateComponent implements OnChanges {
    @Input() dataOnePromotion!: any;
    @Output() actionEvent = new EventEmitter<string>();

    constructor(
        private messageService: MessageService,
        private _service: ActivationService,
        private taskService: TaskFileService,
        private _file: FileService,
        private edService: EncryptDecryptService
    ) {}

    project: any;
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter((d: any) => d.project_id == Helper.ProjectID())[0];
    }

    ngOnInit(): void {
        this.projectName();
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.getDate();
    }

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
    }

    from_date: any = null;
    to_date: any = null;

    setDate(date: any) {
        if (Helper.IsNull(date) != true) {
            if (Helper.IsNull(date[0]) != true) {
                this.from_date = Helper.convertDate(new Date(date[0]));
                this.from_date = Helper.transformDateInt(
                    new Date(this.from_date)
                );
            } else {
                this.from_date = null;
            }

            if (Helper.IsNull(date[1]) != true) {
                this.to_date = Helper.convertDate(new Date(date[1]));
                this.to_date = Helper.transformDateInt(new Date(this.to_date));
            } else {
                this.to_date = null;
            }
        } else {
            this.from_date = null;
            this.to_date = null;
        }
    }

    image!: string;
    imageFile!: any;
    promotion_id!: number;
    promotion_code!: any;
    promotion_group!: any;
    promotion_name!: any;
    description!: any;
    status: number = 0;
    desc_image!: string;

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

    ngOnChanges(changes: SimpleChanges): void {
        this.promotion_code = undefined;
        this.promotion_group = undefined;
        this.promotion_name = undefined;
        this.description = undefined;
        this.status = 0;
        this.desc_image = '';
        if (
            changes['dataOnePromotion'] &&
            this.dataOnePromotion !== undefined
        ) {
            this.dataOnePromotion.forEach((e: any) => {
                this.promotion_code = e.promotion_code;
                this.promotion_group = e.promotion_group;
                this.promotion_name = e.promotion_name;
                this.description = e.description;
                this.status = e.status;
                (this.desc_image = e.desc_image),
                    (this.promotion_id = e.promotion_id);
            });
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
            //   if (data.result == EnumStatus.ok) {
            //     this.desc_image = EnumSystem.fileLocal + data.data;
            //     // this.inValue.image = EnumSystem.fileLocal + data.data;
            //   }
            // });

            const fileName = AppComponent.generateGuid();
            const newFile = new File(
                [this.imageFile],
                fileName +
                    this.imageFile.name.substring(
                        this.imageFile.name.lastIndexOf('.')
                    ),
                { type: this.imageFile.type }
            );
            const modun = 'POROMOTION-IMAGE';
            const drawText = code;
            this._file
                .FileUpload(newFile, this.project.project_code, modun, drawText)
                .subscribe(
                    (response: any) => {
                        this.desc_image = response.url;
                    },
                    (error: any) => {
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
        this.setDate(this.date);

        // promotion_code
        if (this.dataOnePromotion === undefined) {
            if (Helper.IsNull(this.promotion_code) == true) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Please enter a promotion code',
                });
                return;
            }
            if (Pf.checkLengthCode(this.promotion_code) != true) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Character length of promotion code must be greater than or equal to 8',
                });
                return;
            }
            if (Pf.checkSpaceCode(this.promotion_code) == true) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Promotion code must not contain empty characters',
                });

                return;
            }
            if (Pf.checkUnsignedCode(this.promotion_code) == true) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Promotion code is not allowed to enter accented characters',
                });

                return;
            }
            if (Pf.CheckAccentedCharacters(this.promotion_code) == true) {
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
                    0,
                    0,
                    1000000,
                    1
                )
                .subscribe((data: any) => {
                    const result = data.data.filter(
                        (x: any) =>
                            x.promotion_code.toUpperCase() ==
                            this.promotion_code.toUpperCase()
                    );

                    if (result && result.length > 0) {
                        this.messageService.add({
                            severity: EnumStatus.warning,
                            summary: EnumSystem.Notification,
                            detail: 'Promotion code already exist',
                        });
                    } else {
                        this._service
                            .Promotion_Action(
                                Helper.ProjectID(),
                                0,
                                this.promotion_code,
                                this.promotion_group,
                                this.promotion_name,
                                this.description,
                                this.desc_image,
                                this.status,
                                this.from_date,
                                this.to_date,
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

            this._service
                .Promotion_Action(
                    Helper.ProjectID(),
                    this.promotion_id,
                    this.promotion_code,
                    this.promotion_group,
                    this.promotion_name,
                    this.description,
                    this.desc_image,
                    this.status,
                    this.from_date,
                    this.to_date,
                    'update'
                )
                .subscribe((res: any) => {
                    if (res.result === EnumStatus.ok) {
                        this.NofiResult(
                            'Page Promotion Shop',
                            'Update Promotion',
                            `Success update Promotion ${this.promotion_code} - ${this.promotion_name} `,
                            'success',
                            'Successful'
                        );
                        this.clearFileInput();
                        this.actionEvent.emit();
                    }
                });
        }
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
