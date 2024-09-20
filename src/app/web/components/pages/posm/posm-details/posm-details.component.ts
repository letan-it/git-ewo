import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { FileService } from 'src/app/web/service/file.service';
import { PosmService } from 'src/app/web/service/posm.service';

@Component({
    selector: 'app-posm-details',
    templateUrl: './posm-details.component.html',
    styleUrls: ['./posm-details.component.scss'],
})
export class PosmDetailsComponent {
    constructor(
        private messageService: MessageService,
        private _service: PosmService,
        private _file: FileService,
        private taskService: TaskFileService,
        private edService: EncryptDecryptService,
    ) { }

    posm_code!: string;
    posm_name!: string;
    posm_image!: string;
    _status: boolean = false;

    @Input() action: any = 'create';
    @Input() clearMess: any;
    @Input() inValue: any;

    @Output() newItemEvent = new EventEmitter<boolean>();

    file!: File;
    // On file Select
    onChange(event: any) {
        this.file = event.target.files[0];
        this.taskService.ImageRender(this.file, this.file.name).then((file) => {
            this.file = file;
        });
    }

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
    ngOnInit(){
        this.projectName ();
    }


    clear() {
        this.posm_code = '';
        this.posm_name = '';
        this.posm_image = '';
        this._status == false;
    }
    createPosmList() {
        if (Helper.IsNull(this.posm_code) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a posm code',
            });
            return;
        }

        if (Pf.checkLengthCode(this.posm_code) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Character length of posm code must be greater than or equal to 8',
            });
            return;
        }

        if (Pf.checkSpaceCode(this.posm_code) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Posm code must not contain empty characters',
            });
            return;
        }
        if (Pf.checkUnsignedCode(this.posm_code) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Posm code is not allowed to enter accented characters',
            });
            return;
        }

        const posmList = this.inValue.filter(
            (x: any) => x.posm_code == this.posm_code
        );
        if (posmList.length > 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Posm code already exist',
            });
            return;
        }

        if (
            Helper.IsNull(this.posm_name) == true ||
            Pf.checkSpace(this.posm_name) != true
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a posm name',
            });
            return;
        }

        if (Helper.IsNull(this.file) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a posm image',
            });
            return;
        }

        if (Helper.IsNull(this.file) != true) {
            const formDataUpload = new FormData();
            formDataUpload.append('files', this.file);
            formDataUpload.append('ImageType', this.posm_code);
            formDataUpload.append('WriteLabel', this.posm_name);


            const fileName = AppComponent.generateGuid();
            const newFile = new File([this.file], fileName+this.file.name.substring(this.file.name.lastIndexOf('.')),{type: this.file.type});
            const modun = 'POSM-IMAGE';
            const drawText =  this.posm_name ;
            this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                (response : any) => {    
                    this.posm_image = response.url;   
                    this._service
                        .POSM_ListAction(
                            Helper.ProjectID(),
                            0,
                            this.posm_code,
                            this.posm_name,
                            this.posm_image,
                            'create',
                            this._status == true ? 1 : 0
                        )
                        .subscribe((data: any) => {
                            if (data.result == EnumStatus.ok) {
                                if (data.data) {

                                    AppComponent.pushMsg(
                                        'Page POSM',
                                        'Create posm list',
                                        'Create posm list successful',
                                        EnumStatus.info,
                                        0
                                    );

                                    this.clear();
                                    this.addNewItem();
                                    return;
                                } else {
                                    this.clearMess = false;
                                }
                            }
                        });
                },
                (error : any) => {  
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error',
                    });
                    return;
                }
            );

            /*
            this._file.UploadImage(formDataUpload).subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.posm_image = EnumSystem.fileLocal + data.data;

                    this._service
                        .POSM_ListAction(
                            Helper.ProjectID(),
                            0,
                            this.posm_code,
                            this.posm_name,
                            this.posm_image,
                            'create',
                            this._status == true ? 1 : 0
                        )
                        .subscribe((data: any) => {
                            if (data.result == EnumStatus.ok) {
                                if (data.data) {

                                    AppComponent.pushMsg(
                                        'Page POSM',
                                        'Create posm list',
                                        'Create posm list successful',
                                        EnumStatus.info,
                                        0
                                    );

                                    this.clear();
                                    this.addNewItem();
                                    return;
                                } else {
                                    this.clearMess = false;
                                }
                            }
                        });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error',
                    });
                    return;
                }
            });*/
        }
    }

    addNewItem() {
        this.newItemEvent.emit(false);
    }
}
