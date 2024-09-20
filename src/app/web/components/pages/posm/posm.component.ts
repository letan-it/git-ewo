import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { AppComponent } from 'src/app/app.component';
import { ExportService } from 'src/app/web/service/export.service';
import { FileService } from 'src/app/web/service/file.service';
import { PosmService } from 'src/app/web/service/posm.service';
import { DatePipe } from '@angular/common';
import { Pf } from 'src/app/_helpers/pf';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';

@Component({
    templateUrl: './posm.component.html',
    styleUrls: ['./posm.component.scss'],
})
export class PosmComponent {
    menu_id = 8;
    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );

        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }
    items_menu: any = [
        { label: ' SETTING KPI' },
        {
            label: ' POSM',
            icon: 'pi pi-briefcase',
            routerLink: '/posm',
        },
        { label: ' Add POSM', icon: 'pi pi-plus-circle' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    ListPosm: any;
    posm!: any;

    // item_ShopRouter: number = 0;
    ListPosmCreate: boolean = false;
    clearMess: boolean = true;

    statuses!: any;

    // selectShopRouter(event: any) {
    //     this.item_ShopRouter = event != null ? event.code : 0;
    // }
    PlanDate: any;
    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }

    selectMonth: any;
    ListMonth: any = [];
    getMonth(date: Date, format: string) {
        const year = 2023;
        const datePipe = new DatePipe('en-US');
        let monthNow = parseInt(datePipe.transform(date, format) as any) || 0;
        if (monthNow < 12) {
            monthNow++;
        }
        for (let month = 1; month <= monthNow; month++) {
            const monthString = month.toString().padStart(2, '0');
            const yearMonth = `${year} - Tháng ${monthString}`;
            this.ListMonth.push({
                name: yearMonth,
                code: `${year}${monthString}`,
            });
            if (month == monthNow - 1) {
                this.selectMonth = {
                    name: yearMonth,
                    code: `${year}${monthString}`,
                };
            }
        }
    }

    constructor(
        private messageService: MessageService,
        private _service: PosmService,
        private _file: FileService,
        private serviceExport: ExportService,
        private taskService: TaskFileService,
        private router: Router,
        private edService: EncryptDecryptService,
    ) { }

    LoadData() {
        this.ListPosm = [];
        this._service
            .GetPOSM_List(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.ListPosm = data.data;
                        this.ListPosm = this.ListPosm.map((item: any) => ({
                            ...item,
                            _status: item.status == 1 ? true : false,
                        }));
                    }
                }
            });

        this.statuses = [
            { label: 'Active', value: 1 },
            { label: 'In Active', value: 0 },
        ];
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

    ngOnInit() {
        this.projectName();
        this.check_permissions();
        this.LoadData();
        let newDate = new Date();
        this.PlanDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.getMonth(newDate, 'MM');
    }
    export() {
        // this.serviceExport.ExportShopRouter(Helper.ProjectID());
    }

    fileImage: any;
    file!: any;

    // On file Select
    onChange(event: any) {
        this.file = event.target.files[0];

        this.taskService.ImageRender(this.file, this.file.name).then((file) => {
            this.file = file;
        });
    }

    onRowEditSave(posm: any) {
        if (
            Helper.IsNull(posm.posm_name) == true ||
            Pf.checkSpace(posm.posm_name) != true
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a posm name',
            });
            this.LoadData();
            return;
        }

        //     if (Helper.IsNull(this.file) == true) {
        //         this.messageService.add({ severity: 'warn',  summary: 'Warning',
        //         detail: 'Please enter a file',});
        //         this.LoadData()
        //         return;
        //    }

        if (Helper.IsNull(this.file) != true) {
            const formDataUpload = new FormData();
            formDataUpload.append('files', this.file);
            formDataUpload.append('ImageType', posm.posm_code);
            formDataUpload.append('WriteLabel', posm.posm_name);


            const fileName = AppComponent.generateGuid();
            const newFile = new File([this.file], fileName+this.file.name.substring(this.file.name.lastIndexOf('.')),{type: this.file.type});
            const modun = 'POSM-IMAGE';
            const drawText = posm.posm_name;
            this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                (response : any) => {    
                    posm.posm_image = response.url; 

                    this._service
                        .POSM_ListAction(
                            Helper.ProjectID(),
                            posm.posm_id,
                            posm.posm_code,
                            posm.posm_name,
                            posm.posm_image,
                            'update',
                            posm._status == true ? 1 : 0
                        )
                        .subscribe((data: any) => {
                            if (data.result == EnumStatus.ok) {
                                if (data.data) {
                                    this.NofiResult('Page POSM', 'Update posm list', `Successfully edit POSM with information of POSM code 
                                    (${posm.posm_code}), POSM name (${posm.posm_name}), POSM image (${posm.posm_image})`, 'success', 'Successfull');



                                    posm = data.data;
                                    this.file = undefined;
                                    // this.LoadData()
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
                }
            );

            /*
            this._file.UploadImage(formDataUpload).subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    posm.posm_image = EnumSystem.fileLocal + data.data;

                    this._service
                        .POSM_ListAction(
                            Helper.ProjectID(),
                            posm.posm_id,
                            posm.posm_code,
                            posm.posm_name,
                            posm.posm_image,
                            'update',
                            posm._status == true ? 1 : 0
                        )
                        .subscribe((data: any) => {
                            if (data.result == EnumStatus.ok) {
                                if (data.data) {
                                    this.NofiResult('Page POSM', 'Update posm list', `Successfully edit POSM with information of POSM code 
                                    (${posm.posm_code}), POSM name (${posm.posm_name}), POSM image (${posm.posm_image})`, 'success', 'Successfull');



                                    posm = data.data;
                                    this.file = undefined;
                                    // this.LoadData()
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
                }
            });
*/

        } else {
            this._service
                .POSM_ListAction(
                    Helper.ProjectID(),
                    posm.posm_id,
                    posm.posm_code,
                    posm.posm_name,
                    posm.posm_image,
                    'update',
                    posm._status == true ? 1 : 0
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data) {
                            this.NofiResult('Page POSM', 'Update POSM', `Successfully edit POSM with information of POSM code 
                            (${posm.posm_code}), POSM name (${posm.posm_name}), POSM image (${posm.posm_image})`, 'success', 'Successfull');

                            posm = data.data;
                            this.file = undefined;
                            // this.LoadData()
                        } else {
                            this.clearMess = false;
                        }
                    }
                });
        }
    }
    createListPosm() {
        this.ListPosmCreate = true;
    }

    addItem(newItem: boolean) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Success create posm list',
        });
        this.LoadData();
        this.ListPosmCreate = newItem;
    }

    clear() {
        // this.messageService.clear();
    }

    reasonView() {
        this.router.navigate(['/posm/reason']);
    }

    showTemplate: number = 0;
    ShowHideTemplate() {
        if (this.showTemplate == 1) {
            this.showTemplate = 0;
        } else {
            this.showTemplate = 1;
        }
    }
    exportTemplate() {
        if (this.ListPosm.length == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'No posm found',
            });
        } else {
            this._service.POSMShop_GetTemplate(Helper.ProjectID());
        }
    }

    fileTemplete!: any;

    // On file Select
    onChangeFile(event: any) {
        this.fileTemplete = event.target.files[0];
    }

    @ViewChild('myInput') myInput: any;

    clearFileInput() {
        this.myInput.nativeElement.value = null;
        this.fileTemplete = undefined;
    }

    importTemplate() {
        if (this.fileTemplete == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a file',
            });

            return;
        }

        if (Helper.IsNull(this.selectMonth) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a month',
            });
            return;
        }

        // return
        const formDataUpload = new FormData();
        formDataUpload.append('files', this.fileTemplete);
        formDataUpload.append('year_month', this.selectMonth.code);

        this._service
            .POSMShop_ImportData(formDataUpload, Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.result_ewo_type_POSMSHOP.length > 0) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Successful POSM registration',
                        });

                        let newDate = new Date();
                        this.PlanDate = this.getFormatedDate(
                            newDate,
                            'YYYY-MM-dd'
                        );
                        this.getMonth(newDate, 'MM');

                        this.clearFileInput();
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error POSM registration',
                        });
                    }
                }
            });
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
            0,
        );

    }
}
