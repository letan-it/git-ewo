import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { ExportService } from 'src/app/web/service/export.service';
import { FileService } from 'src/app/web/service/file.service';
import { PosmService } from 'src/app/web/service/posm.service';
import { environment } from 'src/environments/environment';

@Component({
    templateUrl: './reason.component.html',
})
export class ReasonComponent {
    items_menu: any = [
        { label: ' SETTING KPI' },
        {
            label: ' POSM',
            icon: 'pi pi-briefcase',
            routerLink: '/posm',
        },
        { label: ' Reason POSM', icon: 'pi pi-question-circle' },

    ];

    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
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
    ListReason: any;
    posm!: any;

    // item_ShopRouter: number = 0;
    ListReasonCreate: boolean = false;
    clearMess: boolean = true;

    statuses!: any;

    constructor(
        private messageService: MessageService,
        private _service: PosmService,
        private _file: FileService,
        private serviceExport: ExportService,
        private router: Router
    ) { }

    LoadData() {
        this.ListReason = [];
        this._service
            .GetPOSM_Reason(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.ListReason = data.data;
                        this.ListReason = this.ListReason.map((item: any) => ({
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
    ngOnInit() {
        this.check_permissions();
        this.LoadData();
    }
    export() {
        // this.serviceExport.(Helper.ProjectID());
        this._service.POSM_Reason_Export(Helper.ProjectID());
    }

    file!: File;
    // On file Select
    onChange(event: any) {
        this.file = event.target.files[0];
    }

    onRowEditSave(reason: any) {
        if (
            Helper.IsNull(reason.reason_name) == true ||
            Pf.checkSpace(reason.reason_name) != true
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a reason name',
            });
            //  this.LoadData()
            return;
        }

        const reasonList = this.ListReason.filter(
            (x: any) => x.reason_name == reason.reason_name
        );

        if (reasonList.length > 1) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Reason name already exist',
            });
            return;
        }

        this._service
            .POSM_ReasonAction(
                reason.reason_id,
                Helper.ProjectID(),
                reason.reason_name,
                'update',
                reason._status == true ? 1 : 0
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data) {

                        this.NofiResult('Page Reason', 'Update reason', 'Update reason successful', 'success', 'Successfull');
                        this.LoadData();
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Update reason error',
                        });
                        this.clearMess = false;
                    }
                }
            });
    }
    createListReason() {
        this.ListReasonCreate = true;
    }

    addItem(newItem: boolean) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Success create reason',
        });
        this.LoadData();
        this.ListReasonCreate = newItem;
    }

    clear() {
        // this.messageService.clear();
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
