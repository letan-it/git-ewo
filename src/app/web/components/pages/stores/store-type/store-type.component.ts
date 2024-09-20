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
    selector: 'app-store-type',
    templateUrl: './store-type.component.html',
    // styleUrls: ['./store-type.component.scss'],
})
export class TypeComponent {
    items_menu: any = [
        { label: ' PROJECT' },
        { label: ' Store', icon: 'pi pi-home', routerLink: '/stores' },
        { label: ' Type', icon: 'pi pi-caret-right' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    ListStoreType: any;
    storeType!: any;

    item_ShopType: number = 0;
    StoreTypeCreate: boolean = false;
    clearMess: boolean = true;

    statuses!: any;

    selectShopRouter(event: any) {
        this.item_ShopType = event != null ? event.code : 0;
    }

    constructor(
        private messageService: MessageService,
        private _service: ShopsService,
        private serviceExport: ExportService,
        private _serviceMaster: MastersService
    ) {}
 
    LoadData() {
        this.ListStoreType = [];
        this._service.ewo_ShopTypes_List(Helper.ProjectID()).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                if (data.data.length > 0 ) { 
                    this.ListStoreType = data.data; 
                    this.ListStoreType = this.ListStoreType.map(
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
    export() { 
        this.serviceExport.ewo_ShopTypes_List(Helper.ProjectID());
    }
    onRowEditSave(storeType: any) {
        if (Helper.IsNull(storeType.shop_type_name) == true) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a type name',
            });
            return;
        } else {
            this._service
                .ewo_ShopTypes_Action(
                    storeType._status == true ? 1 : 0,
                    storeType.shop_type_code,
                    storeType.shop_type_name,
                    'update'
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data == 1) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Update store type successful',
                            });

                            AppComponent.pushMsg(
                                'System',
                                'current',
                                'Update store type successful',
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
    createStoreRouter() {
        this.StoreTypeCreate = true;
    }
    onRowRemoveSave() {
        this.LoadData();
    }
    addItem(newItem: boolean) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Success create shop type',
        });
        this.LoadData();
        this.StoreTypeCreate = newItem;
    }

    clear() {
        this.messageService.clear();
    }
}
