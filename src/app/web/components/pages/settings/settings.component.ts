import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MegaMenuItem, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { Pf } from 'src/app/_helpers/pf';
import { MenuService } from 'src/app/web/service/menu.service';
import { Product } from 'src/app/web/models/product';
import { FileService } from 'src/app/web/service/file.service';
import { LogsService } from 'src/app/web/service/logs.service';
import { ProductService } from 'src/app/web/service/product.service';
import { environment } from 'src/environments/environment';
import { ReportsService } from 'src/app/web/service/reports.service';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    providers: [ConfirmationService],
})
export class SettingsComponent {
    queryDialog: boolean = false;

    products1!: Product[];

    product1!: Product;

    selectedProducts1!: Product[] | null;

    submitted1: boolean = false;

    statuses1!: any[];
    datePlan: any | undefined;

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private edService: EncryptDecryptService,
        private logsService: LogsService,
        private _file: FileService,
        private taskService: TaskFileService,
        private menuService: MenuService,
        private reportsService: ReportsService
    ) {

    }

    someObject(item: any) {
        try {
            return JSON.parse(item);
        } catch (e) {
            return item;
        }
    }
    getComputedString(): string {
        // You can put your logic here to compute the string
        return 'This is the computed string.';
    }
    returnStringJson(item: any): string {
        try {
            return JSON.stringify(item, null, 4);
        } catch (error) {
            return item
        }
    }

    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }
    config: any = undefined
    function_config: any = undefined
    isDownloads!: any;
    megaMenuItems: MegaMenuItem[] = [];
    private project_ID: number = Helper.ProjectID();

    arrMenu: any = [];
    arrMenuFirstElement: any = [];
    arrMenuSorted: any = [];


    selectedListRaw: any = null;

    listRawData: any[] = [];


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

    ngOnInit() {
        this.projectName ();
        this.selectedListRaw = this.listRawData[1];


        this.isDownloads = [
            { label: 'Downloaded', value: 1 },
            { label: 'Not downloaded', value: 0 },

        ];

        this.loadUser();
        this.loadDataQuerySupport();

        let newDate = new Date();
        this.datePlan = this.getFormatedDate(newDate, 'YYYY-MM-dd');

        this.currentUser.projects = this.currentUser.projects.filter(
            (data: any) => data.project_id == Helper.ProjectID()
        );

        console.log ( 'currentUser : ', this.currentUser)

        try {
            const parsedObject = JSON.parse(
                this.currentUser.projects[0].configuration
            );
            const formattedJSON = JSON.stringify(parsedObject, null, 4);
            this.config = parsedObject
            this.function_config = this.returnStringJson(this.config.function_config)
            this.currentUser.projects[0].configuration = formattedJSON; 
            
            console.log ( 'this.currentUser.projects[0].configuration : ', this.currentUser.projects[0].configuration)

        } catch (error) { }

        this.menuService.menu_GetList(this.project_ID).subscribe((data: any) => {
            let getDataFromAPI = data.data.map((item: any) => {
                item.check = item.check === 1 ? true : false;
                return item;
            })
            this.arrMenuFirstElement = getDataFromAPI.reduce(function (acc: any, cur: any) {
                let itemFound = acc.find(function (item: any) {
                    return item[0].parent_menu === cur.parent_menu;
                });
                if (itemFound) {
                    itemFound.push(cur);
                } else {
                    acc.push([cur]);
                }
                return acc;
            }, [])[0];
            let formatedMegaMenuItems = getDataFromAPI.filter((item: any) => item.parent_menu !== null).reduce(function (acc: any, cur: any) {
                let itemFound = acc.find(function (item: any) {
                    return item[0].parent_menu === cur.parent_menu;
                });
                if (itemFound) {
                    itemFound.push(cur);
                } else {
                    acc.push([cur]);
                }
                return acc;
            }, []);
            this.arrMenu = formatedMegaMenuItems;
            this.arrMenuSorted = this.arrMenu.map((item: any) => {
                item.sort((a: any, b: any) => {
                    const genreA = a.orders;
                    const genreB = b.orders;

                    let comparison = 0;
                    if (genreA > genreB) {
                        comparison = 1;
                    } else if (genreA < genreB) {
                        comparison = -1;
                    }
                    return comparison;
                })
            })
        });
        this.loadDataReportList();
    }


    loadDataReportList() {
        this.reportsService.Report_list_GetList(Helper.ProjectID()).subscribe((res: any) => {
            if (res.result == EnumStatus.ok) {
                if (res.data.length > 0) {
                    this.listRawData = []
                    res.data.forEach((element: any) => {
                        this.listRawData.push({
                            name: element.report_name,
                            icon: element.icon,
                            key: element.report_id,
                            _check: (element.check == 1) ? true : false
                        })
                    });
                }
            }
        })
    }

    onSaveReportProject(item: any) {

        this.reportsService.Report_project_Action(Helper.ProjectID(), item.key, (item._check == true) ? 1 : 0)
            .subscribe((res: any) => {
                if (res.result == EnumStatus.ok) {
                    if (res.data == 1) {
                        if (item._check == true) {
                            this.NofiSuccess(`Successfully added ${item.name} to the project`)
                        } else {
                            this.NofiSuccess(`Successfully deleted ${item.name} to the project`)
                        }
                    }
                }
            })

    }

    projectDialog: boolean = false;
    submitted: boolean = false;
    statuses!: any[];

    openNew() {
        this.submitted = false;
        this.projectDialog = true;
    }

    editProject() {
        this.projectDialog = true;
    }


    hideDialog() {
        this.projectDialog = false;
        this.submitted = false;
    }
    @ViewChild('myInputFile') myInputFile: any;
    clearFileInput() {
        this.myInputFile.nativeElement.value = null;
        this.imageFile = undefined;
    }

    imageFile!: any;
    onChangeImage(event: any) {
        this.imageFile = event.target.files[0];

        if (this.imageFile != undefined) {
            this.taskService
                .ImageRender(this.imageFile, this.imageFile.name)
                .then((file) => {
                    this.imageFile = file;
                });
            this.loadImage();
        }
        // else {
        //     this.currentUser.projects[0].image = this.currentUser.projects[0].image;
        // }
    }

    loadImage() {
        const formUploadImage = new FormData();
        formUploadImage.append('files', this.imageFile);
        formUploadImage.append('ImageType', this.currentUser.projects[0].project_code);
        formUploadImage.append('WriteLabel', this.currentUser.projects[0].project_code);

        // this._file.UploadImage(formUploadImage).subscribe((data: any) => {
        //     if (data.result == EnumStatus.ok) {
        //         this.currentUser.projects[0].image = EnumSystem.fileLocal + data.data;

        //     }
        // });

        const fileName = AppComponent.generateGuid();
        const newFile = new File([this.imageFile], fileName+this.imageFile.name.substring(this.imageFile.name.lastIndexOf('.')),{type: this.imageFile.type});
        const modun = 'PROJECT-IMAGE';
        const drawText = this.currentUser.projects[0].project_code;
        this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
            (response : any) => {  
                this.currentUser.projects[0].image = response.url;   
            },
            (error : any) => { 
                this.currentUser.projects[0].image = null;
            }
        );


    }

    saveProject() {
        this.submitted = true;

        if (this.NofiIsNull(this.currentUser.projects[0].project_name, 'project name') == 1
            || this.NofiIsNull(this.currentUser.projects[0].image, 'image') == 1
            || this.checkConfiguration(this.currentUser.projects[0].configuration, 'Configuration') == 1) {
            return
        } else {
            const configuration = this.checkaLineJson(this.currentUser.projects[0].configuration)

            this.logsService
                .ewo_Projects_Action(
                    Helper.ProjectID(),
                    this.currentUser.projects[0].project_name,
                    this.currentUser.projects[0].project_desc,
                    this.currentUser.projects[0].image,
                    configuration,
                    'update'
                ).subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data == 1) {

                            this.currentUser.projects = [...this.currentUser.projects];
                            localStorage.setItem(
                                EnumLocalStorage.user,
                                this.edService.encryptUsingAES256(JSON.stringify(this.currentUser))
                            );

                            this.NofiSuccess('Update project successfull')
                            this.clearFileInput()
                            this.projectDialog = false;
                            // this.product = {};
                        }
                    }

                })
        }


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

    // ================================================================== //
    item_SS: number = 0;
    selectEmployee(event: any) {
        this.item_SS = event != null ? event.code : 0;
    }

    listQuerySupport: any = [];
    loadDataQuerySupport() {

        this.logsService
            .QuerySupport_GetList_Web(Helper.ProjectID())
            .subscribe((data: any) => {

                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.listQuerySupport = data.data;
                        this.listQuerySupport = this.listQuerySupport.map(
                            (item: any) => ({
                                ...item,
                                _isDownload:
                                    item.isDownload == 1 ? true : false,
                            })
                        );

                    } else {
                        this.listQuerySupport = data.data;

                    }
                }
            });
    }
    openQuerySupport() {
        this.query = {};
        this.submitted1 = false;
        this.queryDialog = true;
    }

    deleteSelectedProducts1() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products1?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products1 = this.products1.filter(
                    (val) => !this.selectedProducts1?.includes(val)
                );
                this.selectedProducts1 = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000,
                });
            },
        });
    }

    query: any = '';
    editQuerySupport(query: any) {
        this.query = { ...query };
        this.queryDialog = true;
    }

    deleteQuerySupport(query: any) {

        this.confirmationService.confirm({
            message: 'Are you sure you want to delete query ?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {

                this.logsService
                    .QuerySupport_Action(
                        Helper.ProjectID(),
                        query.querySupport_id,
                        0,
                        0,
                        '',
                        'delete'
                    ).subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            if (data.data == 1) {
                                this.NofiSuccess('Delete query support successful');
                                query = {};
                                this.clearQuerySupport();
                                console.log("🚀 ~ file: settings.component.ts:318 ~ SettingsComponent ~ ).subscribe ~ this.listQuerySupport:", this.listQuerySupport)
                            }
                        }
                    })

            },
            reject: (type: any) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                        break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
                        break;
                }
            }
        });


    }

    hideDialog1() {
        this.queryDialog = false;
        this.submitted1 = false;
        this.clearQuerySupport()
    }

    clearQuerySupport() {

        this.loadDataQuerySupport()

        let newDate = new Date();
        this.datePlan = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.item_SS = 0;
        this.queryDialog = false;
        this.query = {};
    }

    saveQuerySupport() {
        this.submitted1 = true;
        const intDatePlan = parseInt(Pf.StringDateToInt(this.datePlan));

        if (
            this.NofiIsNull(this.item_SS, 'employee') == 1 ||
            this.NofiIsNull(this.datePlan, 'plan date') == 1 ||
            this.NofiIsNull(this.query.query_string, 'query string') == 1
        ) {
            return;
        } else {

            this.logsService
                .QuerySupport_Action(
                    Helper.ProjectID(),
                    this.query.querySupport_id,
                    this.item_SS,
                    intDatePlan,
                    this.query.query_string,
                    'create'
                ).subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data == 1) {
                            this.NofiSuccess('Create query support successful');
                            this.clearQuerySupport();
                        }
                    }
                })
        }
    }

    findIndexById1(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products1.length; i++) {
            if (this.products1[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId1(): string {
        let id = '';
        var chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity1(status: string): any {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
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


    fileUrl: any = undefined;
    chooseFile(event: any) {
        this.fileUrl = event.target.files[0];

        this.currentUser.projects = this.currentUser.projects.filter(
            (data: any) => data.project_id == Helper.ProjectID()
        );
    }

    NofiIsNull(value: any, name: any): any {
        let checkk = 0;
        if (Helper.IsNull(value) == true || Pf.checkSpace(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            checkk = 1;
        }
        return checkk;
    }

    NofiSuccess(name: any) {
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: name,
            life: 3000,
        });
    }

    checkConfiguration(value: any, name: any): any {
        let checkk = 0;
        if (Helper.IsNull(value) != true) {
            try {
                value = JSON.parse(value);
                checkk = 0;
            } catch (error) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: name + ' wrong format',
                });
                checkk = 1;
            }
        } else {
            checkk = 0;
        }

        return checkk;
    }

    checkaLineJson(inputJSON: any) {
        try {
            const parsedObject = JSON.parse(inputJSON);
            const formattedJSON = JSON.stringify(parsedObject);
            return formattedJSON;
        } catch (error) {
            return inputJSON;
        }
    }

    // Config Menu
    onRowEditSave(item: any) {
        if (item.check === false) {
            this.menuService.menu_project_Action(
                this.project_ID,
                item.menu_id,
                0
            ).subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Confirmed',
                        detail: 'Success',
                    });
                }
            })
        } else if (item.check === true) {
            this.menuService.menu_project_Action(
                this.project_ID,
                item.menu_id,
                1
            ).subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Confirmed',
                        detail: 'Success',
                    });
                }
            })
        }
    }
}
