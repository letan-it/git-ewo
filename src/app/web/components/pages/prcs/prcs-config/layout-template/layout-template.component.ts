import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { PrcsService } from '../../service/prcs.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { FileService } from 'src/app/web/service/file.service';
import { AppComponent } from 'src/app/app.component';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';

@Component({
    selector: 'app-layout-template',
    templateUrl: './layout-template.component.html',
    styleUrls: ['./layout-template.component.scss'],
})
export class LayoutTemplateComponent {
    messages: Message[] | undefined;
    submitted: boolean = false;
    openNewLayoutTemplate: boolean = false;
    openEditLayoutTemplate: boolean = false;

    constructor(
        private router: Router,
        private _service: PrcsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private taskService: TaskFileService,
        private _file: FileService,
        private edService: EncryptDecryptService
    ) {}

    currentDate: any;

    menu_id = 101;
    items_menu: any = [
        { label: 'PROCESS ' },
        { label: ' Config', icon: 'pi pi-cog', routerLink: '/prcs/config' },
        { label: ' Config Layout Template', icon: 'pi pi-plus' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    check_permissions() {
        if (JSON.parse(localStorage.getItem('menu') + '') != null) {
            const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
                (item: any) => item.menu_id == this.menu_id && item.check == 1
            );
            if (menu.length > 0) {
            } else {
                this.router.navigate(['/empty']);
            }
        }
    }

    //
    editProcessId: any;
    editProcessName: any;
    editLayoutID: any;
    layoutType: any = '';
    // editLayoutType: any;
    layoutImage: any = '';
    editLayoutImage: any;
    layoutName: any = '';
    editLayoutName: any;
    storedProc: any = '';
    editStoredProc: any;
    urlApi: any = '';
    editUrlApi: any;

    filterProcess: any;
    filterProcesses: any = [];
    editInfoProcess: any;
    selectedFilterProcess(e: any) {
        this.filterProcess = e.value === null ? 0 : e.value.process_id;
    }

    filterAction: any;
    filterActions: any = [];
    editAction: any;
    editActions: any = [];
    selectedFilterAction(e: any) {
        this.filterAction = e.value === null ? 0 : e.value.action_type;
    }
    selectedEditAction(e: any) {
        this.editAction = e.value === null ? 0 : e.value.action_type;
    }

    filterLayoutType: any;
    filterLayoutTypes: any = [];
    editLayoutType: any;
    editLayoutTypes: any = [];
    selectedFilterLayoutType(e: any) {
        this.filterLayoutType = e.value === null ? 0 : e.value.layout_type;
    }
    selectedEditLayoutType(e: any) {
        this.editLayoutType = e.value === null ? 0 : e.value.layout_type;
    }

    imageFile!: any;
    userProfile: any;
    onChangeImage(event: any) {
        this.imageFile = event.target.files[0];

        if (this.imageFile != undefined) {
            let WriteLabel = ' - layout-template: ';
            this.taskService
                .ImageRender(this.imageFile, this.imageFile.name)
                .then((file) => {
                    this.imageFile = file;
                });
            console.log(this.imageFile);
            this.loadImage();
        } else {
            this.layoutImage = this.userProfile.image;
        }
    }

    loadImage() {
        const formUploadImage = new FormData();
        formUploadImage.append('files', this.imageFile);
        formUploadImage.append('ImageType', 'img-layout-template');
        formUploadImage.append('WriteLabel', 'layout-template');

        // this._file.UploadImage(formUploadImage).subscribe((data: any) => {
        //   console.log(data.data);
        //   if (data.result == EnumStatus.ok) {
        //     // this.userProfile.image = EnumSystem.fileLocal + data.data;
        //     this.layoutImage = EnumSystem.fileLocal + data.data;
        //     this.editLayoutImage = EnumSystem.fileLocal + data.data;
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
        const modun = 'img-layout-template';
        const drawText = 'layout-template';
        this._file
            .FileUpload(newFile, this.project.project_code, modun, drawText)
            .subscribe(
                (response: any) => {
                    this.layoutImage = response.url;
                    this.editLayoutImage = response.url;
                },
                (error: any) => {
                    this.layoutImage = null;
                    this.editLayoutImage = null;
                }
            );
    }

    project: any;
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter((d: any) => d.project_id == Helper.ProjectID())[0];
        console.log(this.project);
    }

    ngOnInit() {
        this.projectName();
        this.check_permissions();
        this.messages = [
            { severity: 'error', summary: 'Error', detail: 'Error!!!' },
        ];
        this.loadProcess();
        this.loadAction();
        this.loadLayout();
        this.loadData(1);
    }

    loadProcess() {
        this._service
            .PrcGetMaster(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.filterProcesses = data.data.process_list;
                }
            });
    }

    loadAction() {
        this._service
            .PrcGetAction(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.filterActions = data.data.action_list;
                    this.editActions = data.data.action_list;
                }
            });
    }

    loadLayout() {
        this._service
            .PrcGetLayout(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.filterLayoutTypes = data.data.layout_list;
                    this.editLayoutTypes = data.data.layout_list;
                }
            });
    }

    isLoading_Filter: any = false;
    is_loadForm: number = 0;
    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }
    listLayoutTemplate: any = [];
    loadData(pageNumber: number) {
        this.is_loadForm = 1;
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }
        this.isLoading_Filter = true;

        this._service
            .PrcGetLayoutTemplate(
                this.layoutName || '',
                this.filterAction || '',
                this.filterProcess || 0,
                this.filterLayoutType || ''
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listLayoutTemplate = data.data.layout_template;
                    this.totalRecords =
                        Helper.IsNull(this.listLayoutTemplate) !== true
                            ? this.listLayoutTemplate.length
                            : 0;
                    this.isLoading_Filter = false;
                } else {
                    this.listLayoutTemplate = [];
                    this.isLoading_Filter = false;
                }
            });
    }

    openNew() {
        this.openNewLayoutTemplate = true;
    }
    saveLayoutTemplateContent(event: any) {
        this.submitted = true;
        this._service
            .PrcLayoutTemplateAction(
                0,
                this.layoutImage === '' ? null : this.layoutImage,
                this.layoutName,
                this.filterAction,
                this.filterProcess,
                this.layoutType,
                this.storedProc === '' ? null : this.storedProc,
                this.urlApi === '' ? null : this.urlApi,
                'create'
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.openNewLayoutTemplate = false;
                    this.submitted = false;

                    // clear value
                    this.layoutImage = undefined;
                    this.layoutName = undefined;
                    this.filterAction = undefined;
                    this.filterProcess = false;
                    this.filterLayoutType = false;
                    this.storedProc = undefined;
                    this.urlApi = undefined;

                    this.loadData(1);

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Add new Layout Template successfully',
                        detail: '',
                    });
                } else {
                    this.openNewLayoutTemplate = false;
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Error',
                        detail: '',
                    });
                }
            });
    }
    openEdit(item_raw: any) {
        this.openEditLayoutTemplate = true;

        this.editLayoutID = item_raw.layout_id;
        this.editLayoutImage = item_raw.layout_image;
        this.editLayoutName = item_raw.layout_name;
        this.editProcessId = item_raw.process_id;
        this.editInfoProcess = this.filterProcesses?.find((item: any) => {
            return item.process_id === this.editProcessId
                ? JSON.stringify(item.process_name)
                : '';
        });
        this.editProcessName = item_raw.process_name;
        this.editAction = item_raw.action_type;
        this.editLayoutType = item_raw.layout_type;
        this.editStoredProc = item_raw.storedProc;
        this.editUrlApi = item_raw.url_api;
    }
    editLayoutTemplateContent(event: any) {
        this._service
            .PrcLayoutTemplateAction(
                this.editLayoutID,
                this.editLayoutImage,
                this.editLayoutName,
                this.editAction,
                this.editProcessId,
                this.editLayoutType,
                this.editStoredProc,
                this.editUrlApi,
                'update'
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.openEditLayoutTemplate = false;

                    this.loadData(1);

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Edit Layout Template successfully',
                        detail: '',
                    });
                } else {
                    this.openEditLayoutTemplate = false;
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Error',
                        detail: '',
                    });
                }
            });
    }
    openDelete(item_raw: any, event: any) {
        this.editLayoutID = item_raw.layout_id;

        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to delete it?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._service
                    .PrcLayoutTemplateAction(
                        this.editLayoutID,
                        this.editLayoutImage,
                        this.editLayoutName,
                        this.editInfoProcess,
                        this.editAction,
                        this.editLayoutType,
                        this.editStoredProc,
                        this.editUrlApi,
                        'delete'
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.loadData(1);

                            this.messageService.add({
                                severity: 'success',
                                summary: 'Delete Layout Template successfully',
                                detail: '',
                            });
                        } else {
                            this.messageService.add({
                                severity: 'danger',
                                summary: 'Error',
                                detail: '',
                            });
                        }
                    });
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

    showFilter: number = 1;
    ShowHideFilter() {
        if (this.showFilter == 1) {
            this.showFilter = 0;
        } else {
            this.showFilter = 1;
        }
    }

    urlGallery: any;
    showImageProduct(url: any) {
        this.urlGallery = url;
        document.open(
            <string>this.urlGallery,
            'windowName',
            'height=700,width=900,top=100,left= 539.647'
        );
    }
}
