import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { ShopsService } from 'src/app/web/service/shops.service';

@Component({
    selector: 'app-store-project-detail',
    templateUrl: './store-project-detail.component.html',
    styleUrls: ['./store-project-detail.component.scss'],
    providers: [MessageService],
})
export class StoreProjectDetailComponent {
    constructor(
        private messageService: MessageService,
        private _service: ShopsService
    ) { }

    @Input() action: any = 'create';
    @Input() inValue: any;
    @Output() newItemEvent = new EventEmitter<boolean>();
    @Output() Outprojectlist = new EventEmitter<any>();

    shop_code!: string;
    customer_code: string = '';
    // shop_id!: number
    // project_id!: number
    // manager_id!: number
    _status: boolean = true;

    itemManager: number = 0;
    selectManager(event: any) {
        this.itemManager = event != null ? event.code : 0;
    }

    item_Project: number = 0;
    selectProject(event: any) {
        this.item_Project = event != null ? event.Id : 0;
    }
    project_id: any;
    ngOnInit(): void {
        this.project_id = Helper.ProjectID();
    }

    msgsShopInfo: Message[] = [];

    clear() {
        this.shop_code = '';
        this.customer_code = '';
        this.itemManager = 0;
        this.item_Project = 0;
        this._status = true;
    }

    createShopInfoProject() {
        if (Helper.IsNull(this.shop_code) == true) {
            this.msgsShopInfo = [];

            this.msgsShopInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a shop code',
                life: 3000,
            });
            return;
        }
        if (Pf.checkLengthCode(this.shop_code) != true) {
            this.msgsShopInfo = [];

            this.msgsShopInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Character length of shop code must be greater than or equal to 8',
                life: 3000,
            });
            return;
        }
        if (Pf.checkSpaceCode(this.shop_code) == true) {
            this.msgsShopInfo = [];

            this.msgsShopInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Shop code must not contain empty characters',
                life: 3000,
            });
            return;
        }
        if (Pf.checkUnsignedCode(this.shop_code) == true) {
            this.msgsShopInfo = [];

            this.msgsShopInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Shop code is not allowed to enter accented characters',
                life: 3000,
            });
            return;
        }

        if (
            this.customer_code != '' &&
            Pf.checkLengthCode(this.customer_code) != true
        ) {
            this.msgsShopInfo = [];

            this.msgsShopInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Character length of customer code must be greater than or equal to 8',
                life: 3000,
            });
            return;
        }
        if (
            this.customer_code != '' &&
            Pf.checkSpaceCode(this.customer_code) == true
        ) {
            this.msgsShopInfo = [];

            this.msgsShopInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Customer code must not contain empty characters',
                life: 3000,
            });
            return;
        }
        if (
            this.customer_code != '' &&
            Pf.checkUnsignedCode(this.customer_code) == true
        ) {
            this.msgsShopInfo = [];

            this.msgsShopInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Customer code is not allowed to enter accented characters',
                life: 3000,
            });
            return;
        }

        if (this.item_Project == 0) {
            this.msgsShopInfo = [];

            this.msgsShopInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a project',
                life: 3000,
            });
            return;
        }

        this._service
            .ewo_ShopInfoProject_Action(
                this.shop_code,
                this.customer_code,
                this.inValue.shop_id,
                this.item_Project,
                this.itemManager,
                this._status == true ? 1 : 0,
                'create'
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        AppComponent.pushMsg(
                            'Page Shop',
                            'Create shop info project',
                            'Create shop info project successful',
                            EnumStatus.info,
                            0
                        );

                        const shopInfo = this.inValue.shopinfo;
                        this.inValue.shopinfo = data.data;
                        this.Outprojectlist.emit(shopInfo);
                        this.displayShopInfo();
                        this.clear();
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Create shop info project error',
                        });
                        return;
                    }
                }
            });
    }

    displayShopInfo() {
        this.newItemEvent.emit(false);
    }
}
