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
import { ConfirmationService, MessageService } from 'primeng/api';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { DocumentService } from 'src/app/web/service/document.service';
import { FileService } from 'src/app/web/service/file.service';

@Component({
    selector: 'app-doc-details',
    templateUrl: './doc-details.component.html',
    styleUrls: ['./doc-details.component.scss'],
    providers: [ConfirmationService, MessageService],
})
export class DocDetailsComponent {
    constructor(
        private fileService: FileService,
        private edService: EncryptDecryptService,
        private messageService: MessageService,
        private _service: DocumentService
    ) {}
    @Input() data: any;
    @Input() actionDetails: any;
    @Output() outValue = new EventEmitter<any>();
    @ViewChild('myInput') myInput: any;

    project: any;
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter((d: any) => d.project_id == Helper.ProjectID())[0];
    }

    ngOnInit() {
        this.projectName();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] && this.data !== undefined) {
            this.list_file = [
                {
                    file_name: this.data.file_name,
                    url: this.data.file_url,
                },
            ];
        }
    }

    action() {
        if (
            this.NofiIsNull(this.data.group_code, 'group code') == 1 ||
            this.checkSpaceCode(this.data.group_code, 'Group code') == 1 ||
            this.checkUnsignedCode(this.data.group_code, 'Group code') == 1 ||
            this.NofiIsNull(this.data.file_name, 'file name') == 1
        ) {
            return;
        } else {
            // console.log ( 'STATUS: ',  Helper.IsNull(this.data.status) != true || this.data.status == 0  ? this.data.status : 1 )
            // console.log ( 'ACTION: ',
            //           Helper.ProjectID(),
            //           Helper.IsNull(this.data) != true ? this.data.file_id : 0,
            //           this.data.group_code,
            //           Helper.IsNull(this.data.file_group) != true ? this.data.file_group : null,
            //           this.data.file_name,
            //           Helper.IsNull(this.data.file_url) != true ? this.data.file_url : null,
            //           Helper.IsNull(this.data.html_content) != true ? this.data.html_content : null,
            //           Helper.IsNull(this.data.status) != true || this.data.status == 0  ? this.data.status : 1,
            //           this.actionDetails
            // )
            // this.loadData(this.actionDetails);
            // return;

            this._service
                .Documents_Action(
                    Helper.ProjectID(),
                    Helper.IsNull(this.data) != true ? this.data.file_id : 0,
                    this.data.group_code,
                    Helper.IsNull(this.data.file_group) != true
                        ? this.data.file_group
                        : null,
                    this.data.file_name,
                    Helper.IsNull(this.data.file_url) != true
                        ? this.data.file_url
                        : null,
                    Helper.IsNull(this.data.html_content) != true
                        ? this.data.html_content
                        : null,
                    Helper.IsNull(this.data.status) != true ||
                        this.data.status == 0
                        ? this.data.status
                        : 1,
                    this.actionDetails
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data == 1) {
                            // this.NofiResult(
                            //     'Page Document',
                            //     this.actionDetails + ' document',
                            //     this.actionDetails + ' document successfull',
                            //     'success',
                            //     'Successfull'
                            // );
                            this.loadData(this.actionDetails);
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: this.actionDetails + ' document error',
                            });
                            return;
                        }
                    }
                });
        }
    }
    loadData(actionDetails: any) {
        this.outValue.emit({
            check: true,
            action: actionDetails,
        });
    }
    showDescription: boolean = false;
    showDescript() {
        this.showDescription = !this.showDescription;
    }
    status: number = 0;
    promotion_Code: any = null;
    promotion_name: any = null;
    promotion_group: any = null;
    desc_image: any = null;

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

    itemStatus: any = this.statuses[0];
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
    list_file: any = [];
    removeList: any;
    removeItem(itemToRemove: any): void {
        this.removeList = this.list_file.filter(
            (e: any) => e.url == itemToRemove
        );
        this.list_file = this.list_file.filter(
            (item: any) => item.url !== itemToRemove
        );
        this.data.file_url = null;
    }
    filepload: any = null;
    filename: any = null;
    updateFile: any = [];
    checkUpdate: number = 0;
    onUploadFile(event: any) {
        this.updateFile = [];
        this.filepload = event.target.files[0];

        if (this.filepload) {
            this.checkUpdate = 1;
        }
        if (Helper.IsNull(this.filename) == true) {
            this.filename = this.filepload.name;
        }

        var fileNameUrl = null as any;
        if (Helper.IsNull(this.data.file_name) == true) {
            fileNameUrl = this.filepload.name;
        } else {
            fileNameUrl = this.data.file_name;
        }

        const formUploadImageBefore = new FormData();
        formUploadImageBefore.append('files', this.filepload);
        formUploadImageBefore.append('ImageType', 'TaskList');

        const fileName = AppComponent.generateGuid();
        const newFile = new File(
            [this.filepload],
            fileName +
                this.filepload.name.substring(
                    this.filepload.name.lastIndexOf('.')
                ),
            { type: this.filepload.type }
        );
        const modun = 'DOCUMENT';
        // const drawText =  this.filename;
        const drawText = this.data.file_name;
        this.fileService
            .FileUpload(newFile, this.project.project_code, modun, drawText)
            .subscribe(
                (response: any) => {
                    // this.list_file.push({
                    //   file_name: this.filename,
                    //   url: response.url
                    // });
                    console.log('response.url : ', response.url);
                    this.list_file = [
                        {
                            file_name: fileNameUrl,
                            url: response.url,
                        },
                    ];
                    this.data.file_url = response.url;
                    this.filename = undefined;
                    this.filepload = undefined;
                    this.myInput.nativeElement.value = null;
                },
                (error: any) => {
                    this.filename = undefined;
                    this.filepload = undefined;
                    this.myInput.nativeElement.value = null;
                }
            );
    }

    image: any = null;
    onImageErrorImage(e: any, type: string) {
        if (type == 'image') {
            this.image = EnumSystem.imageError;
        }
    }

    selectStatus(e: any) {
        // console.log ('selectStatus: ', e.value)
        //this.status = e.value === null ? 1 : e.value;
        this.data.status = e.value === null ? -1 : e.value;
        console.log('this.data.status : ', this.data.status);
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

    checkSpaceCode(value: any, name: any): any {
        let check = 0;
        if (Pf.checkSpaceCode(value) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: `${name} must not contain empty characters`,
            });
            check = 1;
        }
        return check;
    }

    checkUnsignedCode(value: any, name: any): any {
        let check = 0;
        if (Pf.checkUnsignedCode(value) == true) {
            this.messageService.add({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: `${name} is not allowed to enter accented characters`,
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
}
