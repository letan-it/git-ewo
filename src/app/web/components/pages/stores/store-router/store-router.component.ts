import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { AppComponent } from 'src/app/app.component';
import { ExportService } from 'src/app/web/service/export.service';
import { ShopsService } from 'src/app/web/service/shops.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-store-router',
    templateUrl: './store-router.component.html',
    styleUrls: ['./store-router.component.scss'],
})
export class RouterComponent implements OnInit {
    items_menu: any = [
        { label: ' PROJECT' },
        { label: ' Store', icon: 'pi pi-home', routerLink: '/stores' },
        { label: ' Router', icon: 'pi pi-sitemap' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    ListStoreRouter: any;
    storeRouter!: any;

    item_ShopRouter: number = 0;
    StoreRouterCreate: boolean = false;
    clearMess: boolean = true;

    statuses!: any;

    selectShopRouter(event: any) {
        this.item_ShopRouter = event != null ? event.code : 0;
    }

    constructor(
        private messageService: MessageService,
        private _service: ShopsService,
        private serviceExport: ExportService
    ) { }

    LoadData() {
        this.ListStoreRouter = [];
        this._service.ewo_GetShopRouter().subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                if (data.data.length > 0) {
                    this.ListStoreRouter = data.data;
                    this.ListStoreRouter = this.ListStoreRouter.map(
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
        // https://audit.ewoapi.acacy.com.vn/api/Exports/ewo_ExportShopRouter
        this.serviceExport.ewo_ExportShop('ewo_ExportShopRouter');
    }
    onRowEditSave(storeRouter: any) {
        if (Helper.IsNull(storeRouter.router_name) == true) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a router name',
            });
            return;
        } else if (Helper.IsNull(storeRouter.router_type) == true) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a router type',
            });
            return;
        } else {
            this._service
                .ewo_ShopRouter_Action(
                    storeRouter._status == true ? 1 : 0,
                    storeRouter.router_code,
                    storeRouter.router_name,
                    storeRouter.router_type,
                    'update'
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data == 1) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Update store router successful',
                            });

                            AppComponent.pushMsg(
                                'System',
                                'current',
                                'Update store router successful',
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
        this.StoreRouterCreate = true;
    }

    addItem(newItem: boolean) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Success create shop router',
        });
        this.LoadData();
        this.StoreRouterCreate = newItem;
    }

    clear() {
        this.messageService.clear();
    }
}
