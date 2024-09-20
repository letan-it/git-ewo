import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { CategoryService } from 'src/app/web/service/category.service';

@Component({
    selector: 'app-category-details',
    templateUrl: './category-details.component.html',
    styleUrls: ['./category-details.component.scss'],
})
export class CategoryDetailsComponent {
    @Input() action: any = 'create';
    @Output() newItemEvent = new EventEmitter<boolean>();
    @Input() inValue: any;

    constructor(
        private _service: CategoryService,
        private messageService: MessageService
    ) { }
    // <!-- {
    //   "category_name": "Category Name 1", => bat buoc

    //   "company": "ACACY 1",
    //   "brand": "ACA 1",
    //   "_package": "CAN 1",
    //   "orders": 1,

    // } -->
    category_name: string = '';

    company: string = '';
    brand: string = '';
    _package: string = '';
    orders: number = 0;

    clear() {
        this.category_name = '';
        this.company = '';
        this.brand = '';
        this._package = '';
        this.orders = 0;
    }

    createCategory() {
        if (Helper.IsNull(this.orders) == true) {
            this.orders = 0;
        }

        if (
            this.NofiIsNull(this.category_name, 'category name') == 1 ||
            this.NofiSpace(this.company, 'Company') == 1 ||
            this.NofiSpace(this.brand, 'Brand') == 1 ||
            this.NofiSpace(this._package, 'Package') == 1 ||
            this.checkNumber(this.orders, 'Orders') == 1
        ) {
            return;
        } else {
            const categoryList = this.inValue.filter(
                (x: any) => x.category_name == this.category_name
            );

            if (categoryList.length > 0) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Category name already exist',
                });
                return;
            } else {
                /*
                                this._service
                                    .Categories_Action(
                                        0,
                                        this.category_name,
                                        this.company,
                                        this.brand,
                                        this._package,
                                        this.orders,
                                        '', '', '', '', '', '', '', '', '', '',
                                        'create'
                                    )
                                    .subscribe((data: any) => {
                                        if (data.result == EnumStatus.ok) {
                                            if (data.data == 1) {
                                                AppComponent.pushMsg(
                                                    'Page Category',
                                                    'current',
                                                    'Create category successfull',
                                                    EnumStatus.info,
                                                    0
                                                );
                                                this.clear();
                                                this.addNewItem();
                                                return;
                                            }
                                        }
                                    });
                                     */
            }

        }

    }

    addNewItem() {
        this.newItemEvent.emit(false);
    }

    NofiIsNull(value: any, name: any): any {
        if (Helper.IsNull(value) == true || Pf.checkSpace(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            return 1;
        }
        return 0;
    }

    NofiSpace(value: any, name: any): any {
        if (Helper.IsNull(value) != true) {
            if (Pf.checkSpace(value) != true) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: name + ' wrong format',
                });
                return 1;
            }
        }
        return 0;
    }

    checkNumber(value: any, name: any): any {
        if (Helper.number(value) != true && Helper.IsNull(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            return 1;
        }
        return 0;
    }
}
