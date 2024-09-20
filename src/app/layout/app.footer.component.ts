import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
})
export class AppFooterComponent {
    constructor(public layoutService: LayoutService) {}
    items: any;
    menuMode: any;
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        let mode = JSON.parse(localStorage.getItem('theme-config') + '').config
            .menuMode;
        if (mode == 'overlay') {
            this.menuMode = 1;
        } else {
            this.menuMode = 0;
        }
        let menu = JSON.parse(localStorage.getItem('menu') + '');
        this.items = [];
        try {
            if (menu.find((x: any) => x.menu_id == 5) != undefined) {
                this.items.push({
                    label: 'dashboard',
                    icon: 'https://icons.iconarchive.com/icons/awicons/vista-artistic/128/chart-icon.png',
                    url: '/dashboard',
                });
            }
            if (menu.find((x: any) => x.menu_id == 6) != undefined) {
                this.items.push({
                    label: 'User',
                    icon: 'https://icons.iconarchive.com/icons/hopstarter/sleek-xp-basic/256/Administrator-icon.png',
                    url: '/users',
                });
            }
            if (menu.find((x: any) => x.menu_id == 7) != undefined) {
                this.items.push({
                    label: 'Store',
                    icon: 'https://icons.iconarchive.com/icons/hopstarter/sleek-xp-basic/128/Home-icon.png',
                    url: '/stores',
                });
            }
            if (menu.find((x: any) => x.menu_id == 10) != undefined) {
                this.items.push({
                    label: 'Plans',
                    icon: 'https://icons.iconarchive.com/icons/marcus-roberto/google-play/128/Google-Calendar-icon.png',
                    url: '/plans',
                });
            }
            if (menu.find((x: any) => x.menu_id == 12) != undefined) {
                this.items.push({
                    label: 'Report',
                    icon: 'https://icons.iconarchive.com/icons/guillendesign/variations-1/128/Document-icon.png',
                    url: '/reports',
                });
            }
        } catch (error) {}
    }
}
