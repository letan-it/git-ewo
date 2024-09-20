import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-breadcrumb-menu',
    templateUrl: './breadcrumb-menu.component.html',
    styleUrls: ['./breadcrumb-menu.component.scss'],
})
export class BreadcrumbMenuComponent {
    @Input() items_menu: any;
    @Input() home: any;
}
