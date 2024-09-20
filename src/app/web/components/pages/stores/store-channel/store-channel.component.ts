import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { AppComponent } from 'src/app/app.component';
import { ExportService } from 'src/app/web/service/export.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { ShopsService } from 'src/app/web/service/shops.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-store-channel',
    templateUrl: './store-channel.component.html',
    styleUrls: ['./store-channel.component.scss'],
})
export class StoreChannelComponent {
    items_menu: any = [
        { label: ' PROJECT' },
        { label: ' Store', icon: 'pi pi-home', routerLink: '/stores' },
        { label: ' Channel', icon: 'pi pi-caret-right' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    ListStoreChannel: any;
    storeChannel!: any;

    item_ShopChannel: number = 0;
    StoreChannelCreate: boolean = false;
    clearMess: boolean = true;

    statuses!: any;

    selectShopRouter(event: any) {
        this.item_ShopChannel = event != null ? event.code : 0;
    }

    constructor(
        private messageService: MessageService,
        private _service: ShopsService,
        private serviceExport: ExportService,
        private master: MastersService
    ) { }

    LoadData() {
        this.ListStoreChannel = [];
        this.master.ewo_GetChannels().subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                if (data.data.length > 0) {
                    this.ListStoreChannel = data.data;
                    this.ListStoreChannel = this.ListStoreChannel.map(
                        (item: any) => ({
                            ...item,
                            _status: item.status == 1 ? true : false,
                        })
                    );
                }
            }
        });

        this.statuses = [
            { label: 'Active', value: 1 },
            { label: 'In Active', value: 0 },
        ];
    }
    ngOnInit() {
        this.LoadData();
    }
    //   https://audit.ewoapi.acacy.com.vn/api/Exports/ewo_GetChannels
    export() {
        this.serviceExport.ewo_ExportShop('ewo_GetChannels');
    }

    onRowEditSave(storeChannel: any) {
        if (Helper.IsNull(storeChannel.channel_name) == true) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a channel name',
            });
            this.LoadData();
            return;
        } else {
            this._service
                .ewo_Channels_Action(
                    storeChannel._status == true ? 1 : 0,
                    storeChannel.channel_code,
                    storeChannel.channel_name,
                    'update'
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data == 1) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Update store channel successful',
                            });

                            AppComponent.pushMsg(
                                'System',
                                'current',
                                'Update store channel successful',
                                EnumStatus.info,
                                0
                            );
                        } else {
                            this.messageService.clear();
                        }
                    }
                });
        }

        this.clearMess = false;
    }
    createStoreChannel() {
        this.StoreChannelCreate = true;
    }
    onRowRemoveSave() {
        this.LoadData();
    }
    addItem(newItem: boolean) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Success create shop channel',
        });
        this.LoadData();
        this.StoreChannelCreate = newItem;
    }

    clear() {
        this.messageService.clear();
    }


}
