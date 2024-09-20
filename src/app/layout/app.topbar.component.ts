import {
    Component,
    ElementRef,
    HostListener,
    Input,
    ViewChild,
} from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { EncryptDecryptService } from '../Service/encrypt-decrypt.service';
import { DatePipe, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { EnumLocalStorage, EnumSystem } from '../Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [MessageService],
})
export class AppTopBarComponent {
    items!: MenuItem[];
    @Input() msg: any;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    countries: any[] = [];
    selectedCountry: any;
    profile: any;
    constructor(
        public layoutService: LayoutService,
        private edService: EncryptDecryptService,
        private router: Router,
        private messageService: MessageService,
        private http: HttpClient
    ) { }
    project: any;
    visible: boolean = false;

    position: string = 'top-right';

    user_profile: string = 'current';
    currentUser: any;
    userProfile: any;

    menuTop: any;
    parent_menu: any;
    model: any[] = [];
    menu_key: string = environment.menu_key;
    getDistinctMenuItems() {
        const uniqueMenuItems = this.menuTop.reduce(
            (acc: any, currentItem: any) => {
                const existingItem = acc.find(
                    (item: any) =>
                        item.label_parent === currentItem.label_parent
                );
                if (!existingItem) {
                    acc.push(currentItem);
                }
                return acc;
            },
            []
        );

        return uniqueMenuItems;
    }
    menuMode = 0;
    loadMenuTop() {
        let _u = localStorage.getItem(EnumLocalStorage.user);

        let mode = JSON.parse(localStorage.getItem('theme-config') + '').config
            .menuMode;
        if (mode == 'overlay' && environment.menu_key == 'routerLink') {
            this.menuMode = 1;
        } else {
            this.menuMode = 0;
        }
        this.currentUser = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).employee[0];

        this.menuTop = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects;
        const menu_temp: any[] = [];
        try {
            this.menuTop = JSON.parse(
                this.menuTop.filter(
                    (item: any) => item.project_id == Helper.ProjectID()
                )[0].menu_list
            );
            this.parent_menu = this.getDistinctMenuItems();
        } catch (error) { }
        try {
            this.parent_menu.forEach((p: any) => {
                const temp_item = this.menuTop.filter(
                    (m: any) => m.label_parent == p.label_parent && m.check == 1
                );
                if (temp_item.length > 0) {
                    const chill_menu: any = [];
                    temp_item.forEach((element: any) => {
                        if (element.share_link == '#') {
                            chill_menu.push({
                                label: element.label,
                                icon: element.icon,
                                routerLink: [element.routerLink],
                            });
                        } else {
                            chill_menu.push({
                                label: element.label,
                                icon: element.icon,
                                url: [element.share_link],
                                target: '_blank',
                            });
                        }
                    });

                    this.model.push({
                        label: p.label_parent,
                        items: chill_menu,
                    });
                }
            });
        } catch (error) { }
    }
    showDialog() {
        this.visible = true;
    }
    isMobile: any = 0;
    checkIfMobile(): void {
        const screenWidth = window.innerWidth;

        if (screenWidth <= 768 && screenWidth >= 100) {
            this.isMobile = 1;
        } else if (screenWidth <= 1000 && screenWidth >= 769) {
            this.isMobile = 2;
        } else {
            this.isMobile = 0;
        }
        // You can adjust this threshold to match your mobile device criteria
        //screenWidth <= 768 ? (this.isMobile = 1) : (this.isMobile = 0); // Example threshold for mobile devices
    }
    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        this.checkIfMobile();
    }
    image_200: any = 0
    checkImageStatus(url: string): void {
        try {
            this.http.get(url, { observe: 'response' })
                .subscribe(response => {
                    // You can check the status code here and perform actions accordingly
                    if (response.status === 200) {
                        // Image is available
                        this.image_200 = 1
                    } else {
                        // Handle other status codes
                        this.image_200 = 0

                    }
                }, error => {
                    // console.error('Error:', error);
                    this.image_200 = 0
                    if (error.status == 200) {
                        this.image_200 = 1
                    }
                    else {
                        this.image_200 = 0
                    }
                    // Handle error, e.g., the image couldn't be loaded
                });
        } catch (error) {

        }

    }
    ngOnInit(): void {
        this.checkIfMobile(); // Initial check

        this.configPage();
        this.loadMenuTop();
        this.items = [
            { label: 'Update', icon: 'pi pi-refresh' },
            { label: 'Delete', icon: 'pi pi-times' },
            {
                label: 'Angular.io',
                icon: 'pi pi-info',
                url: 'http://angular.io',
            },
            { separator: true },
            { label: 'Setup', icon: 'pi pi-cog' },
        ];

        this.countries = JSON.parse(
            this.edService.decryptUsingAES256(
                localStorage.getItem(EnumLocalStorage.user)
            )
        ).projects.filter((x: any) => x.project_id == Helper.ProjectID());

        //
        if (this.countries && this.countries.length > 0) {
            this.selectedCountry = this.countries[0];
        } else {
        }

        if (this.user_profile == EnumSystem.current) {
            let _u = localStorage.getItem(EnumLocalStorage.user);

            this.currentUser = JSON.parse(
                this.edService.decryptUsingAES256(_u)
            );
        } else {
        }

        this.userProfile = this.currentUser.employee[0];
        //  this.checkImageStatus(this.userProfile.image);

    }
    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }

    configPage() {
        setInterval(() => {
            try {
                this.msg = JSON.parse(
                    localStorage.getItem(EnumLocalStorage.message) as string
                );

                this.msg = this.msg.sort(
                    (objA: any, objB: any) =>
                        new Date(objB.timestamp).getTime() -
                        new Date(objA.timestamp).getTime()
                );
            } catch (error) { }
        }, 1000);
        let _U = localStorage.getItem(EnumLocalStorage.user);
        this.profile = JSON.parse(this.edService.decryptUsingAES256(_U));
        const time_login = this.profile.employee[0].login_time;
        try {
            let newDate = new Date();
            if (time_login != this.getFormatedDate(newDate, 'YYYY-MM-dd')) {
                this.router.navigate(['/auth/login']);
                return;
            }
        } catch (error) { }
    }
    routerLink(url: string) {
        localStorage.setItem(EnumLocalStorage.user_profile, EnumSystem.current);
        this.router.navigate([url]);
    }
    CountNotification(isRead: number) {
        try {
            const CountRead = this.msg.filter((m: any) => m.isRead == isRead);
            return CountRead.length;
        } catch (error) {
            return 0;
        }
    }
    ReadAll() {
        this.visible = false;
        this.msg.forEach((m: any) => (m.isRead = 1));
        localStorage.setItem(
            EnumLocalStorage.message,
            JSON.stringify(this.msg)
        );
    }
    ClearNotification() {
        this.visible = false;
        this.msg = [];
        localStorage.setItem(EnumLocalStorage.message, '[]');
    }
    ReadNotification(ViewId: any) {
        this.msg.forEach((m: any) => {
            if (m.id == ViewId.id) {
                m.isRead = 1;
            }
        });
        localStorage.setItem(
            EnumLocalStorage.message,
            JSON.stringify(this.msg)
        );
    }
    logout() {

        this.router.navigateByUrl('/auth/login');

        // if (environment.menu_key === 'routerLink')
        //     this.router.navigateByUrl('/auth/login');
        // else
        //     location.href = environment.url_login;
    }
}
