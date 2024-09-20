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
    selector: 'app-activation-form-create',
    templateUrl: './activation-form-create.component.html',
    styleUrls: ['./activation-form-create.component.scss'],
})
export class ActivationFormCreateComponent implements OnChanges {
    @Input() dataOneForm!: any;
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

    image: any = null;
    imageFile!: any;
    form_id: any = null;
    form_name: any = null;
    form_decription: any = null;
    configuration: any = null;
    status: number = 0;
    desc_image: any = null;

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
        this.form_name = null;
        this.form_decription = null;
        this.configuration = null;
        this.status = 0;
        this.desc_image = '';
        this.date = null;
        if (changes['dataOneForm'] && Helper.IsNull(this.dataOneForm) != true) {
            this.dataOneForm.forEach((e: any) => {
                this.form_name = e.form_name;
                this.form_decription = e.form_decription;
                this.configuration = e.configuration;
                this.from_date = e.from_date;
                this.to_date = e.to_date;
                this.status = e.status;
                (this.desc_image = e.desc_image), (this.form_id = e.form_id);

                if (
                    Helper.IsNull(e._from_date1) != true ||
                    Helper.IsNull(e._to_date1) != true
                ) {
                    this.date = [e._from_date1, e._to_date1];
                }
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
            const modun = 'ACTIVATION-FROM';
            const drawText = code;
            this._file
                .FileUpload(newFile, this.project.project_code, modun, drawText)
                .subscribe(
                    (response: any) => {
                        this.desc_image = response.url;
                    },
                    (error: any) => {
                        this.desc_image = null;
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

    clearSave() {
        this.form_id = null;
        this.form_name = null;
        this.form_decription = null;
        this.configuration = null;
        this.status = -1;
        this.from_date = null;
        this.to_date = null;
    }

    // create
    create() {
        this.setDate(this.date);

        // promotion_code
        if (Helper.IsNull(this.dataOneForm) == true) {
            if (
                this.NofiIsNull(this.form_name, 'form name') == 1 ||
                (Helper.IsNull(this.configuration) != true &&
                    this.NofiErrorConfig(
                        this.configuration,
                        'JSON format error config'
                    ) == 1)
            ) {
                return;
            } else {
                // status
                if (Helper.IsNull(this.status)) {
                    this.status = 0;
                }

                this._service
                    .activation_form_GetList(
                        Helper.ProjectID(),
                        '',
                        -1,
                        0,
                        0,
                        1000000,
                        1
                    )
                    .subscribe((data: any) => {
                        const result = data.data.data.filter(
                            (x: any) =>
                                x.form_name.toUpperCase() ==
                                this.form_name.toUpperCase()
                        );

                        if (result && result.length > 0) {
                            this.messageService.add({
                                severity: EnumStatus.warning,
                                summary: EnumSystem.Notification,
                                detail: 'Form name already exist',
                            });
                        } else {
                            // console.log('activation_form_Action : ', Helper.ProjectID(), 0, this.form_name,
                            //   this.form_decription, this.configuration,
                            //   this.status, this.from_date, this.to_date, "create")

                            this._service
                                .activation_form_Action(
                                    Helper.ProjectID(),
                                    0,
                                    this.form_name,
                                    this.form_decription,
                                    this.configuration,
                                    this.status,
                                    this.from_date,
                                    this.to_date,
                                    'create'
                                )
                                .subscribe((res: any) => {
                                    if (res.result === EnumStatus.ok) {
                                        this.clearFileInput();
                                        this.clearSave();
                                        this.actionEvent.emit();
                                    }
                                });
                        }
                    });
            }
        } else {
            if (
                this.NofiIsNull(this.form_name, 'form name') == 1 ||
                (Helper.IsNull(this.configuration) != true &&
                    this.NofiErrorConfig(
                        this.configuration,
                        'JSON format error config'
                    ) == 1)
            ) {
                return;
            } else {
                // console.log('activation_form_Action : ', Helper.ProjectID(), this.form_id, this.form_name,
                //   this.form_decription, this.configuration,
                //   this.status, this.from_date, this.to_date, "update")

                this._service
                    .activation_form_Action(
                        Helper.ProjectID(),
                        this.form_id,
                        this.form_name,
                        this.form_decription,
                        this.configuration,
                        this.status,
                        this.from_date,
                        this.to_date,
                        'update'
                    )
                    .subscribe((res: any) => {
                        if (res.result === EnumStatus.ok) {
                            this.NofiResult(
                                'Page Form',
                                'Update Form',
                                `Success update Form ${this.form_name} `,
                                'success',
                                'Successful'
                            );
                            this.clearSave();
                            this.clearFileInput();
                            this.actionEvent.emit();
                        }
                    });
            }
        }
    }

    NofiErrorConfig(value: any, name: any): any {
        let check = 0;
        if (this.checksomeObject(value) == 1) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name,
            });
            check = 1;
        }
        return check;
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
