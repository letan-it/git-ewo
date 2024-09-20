import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { ShopsService } from 'src/app/web/service/shops.service';

@Component({
    selector: 'app-store-router-detail',
    templateUrl: './store-router-detail.component.html',
    styleUrls: ['./store-router-detail.component.scss'],
})
export class StoreRouterDetailComponent {
    constructor(
        private messageService: MessageService,
        private _service: ShopsService
    ) { }

    @Input() action: any = 'create';
    @Input() inValue: any;
    @Output() newItemEvent = new EventEmitter<boolean>();

    @Input() clearMess: any;

    ListStoreRouter = [];
    router_code!: string;
    router_name!: string;
    router_type!: string;
    msgsInfo: Message[] = [];
    _status: boolean = false;

    clickStatus() {
        this._status == true ? false : true;
    }
    clear() {
        this.router_code = '';
        this.router_name = '';
        this.router_type = '';
        this._status = false;
    }

    createStoreRouter() {
        this.clearMess = true;

        if (Helper.IsNull(this.router_code) == true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a router code',
                life: 3000,
            });
            // this.messageService.add({ severity: 'error',  summary: 'Error', detail: 'Please enter a router code',});

            return;
        }

        if (Pf.checkLengthCode(this.router_code) != true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Character length of router code must be greater than or equal to 8',
                life: 3000,
            });
            // this.messageService.add({ severity: 'error',  summary: 'Error', detail: 'Character length of router code must be greater than or equal to 8',});

            return;
        }

        if (Pf.checkSpaceCode(this.router_code) == true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Router code must not contain empty characters',
                life: 3000,
            });
            return;
        }
        if (Pf.checkUnsignedCode(this.router_code) == true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Router code is not allowed to enter accented characters',
                life: 3000,
            });
            return;
        }

        if (Helper.IsNull(this.router_name) == true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a router name',
                life: 3000,
            });
            return;
        }

        if (Helper.IsNull(this.router_type) == true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a router type',
                life: 3000,
            });
            return;
        }

        const check = this.inValue.filter(
            (item: any) => item.router_code == this.router_code
        );

        if (check.length > 0) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Router code already exists',
                life: 3000,
            });
            return;
        } else {
            // storeRouter._status == true ? 1 : 0,
            // storeRouter.router_code,
            // storeRouter.router_name,
            // storeRouter.router_type,
            // 'update'

            this._service
                .ewo_ShopRouter_Action(
                    this._status == true ? 1 : 0,
                    this.router_code,
                    this.router_name,
                    this.router_type,
                    'create'
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data == 1) {
                            AppComponent.pushMsg(
                                'System',
                                'current',
                                'Success create shop router ',
                                EnumStatus.info,
                                0
                            );

                            this.clear();
                            this.addNewItem();
                        } else {
                            this.msgsInfo = [];
                            this.msgsInfo.push({
                                severity: EnumStatus.warning,
                                summary: EnumSystem.Notification,
                                detail: 'Error create store router',
                                life: 3000,
                            });

                            AppComponent.pushMsg(
                                'System',
                                'current',
                                'Error create shop router',
                                EnumStatus.info,
                                0
                            );

                            return;
                        }
                    }
                });
        }
    }

    addNewItem() {
        this.newItemEvent.emit(false);
    }
}
