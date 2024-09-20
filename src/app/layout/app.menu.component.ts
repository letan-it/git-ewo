import { Inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { DOCUMENT } from '@angular/common';
import { EnumLocalStorage } from '../Core/_enum';
import { EncryptDecryptService } from '../Service/encrypt-decrypt.service';
import { Router } from '@angular/router';
import { Helper } from 'src/app/Core/_helper';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    constructor(
        public layoutService: LayoutService,
        @Inject(DOCUMENT) private document: any,
        private edService: EncryptDecryptService,
        private router: Router
    ) { }
    currentUser: any;
    menu: any;
    parent_menu: any;
    getDistinctMenuItems() {
        const uniqueMenuItems = this.menu.reduce(
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
    theme: any
    ngOnInit() {
        this.theme = JSON.parse(localStorage.getItem('theme-config') + '')


        let _u = localStorage.getItem(EnumLocalStorage.user);

        this.currentUser = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).employee[0];

        this.menu = JSON.parse(this.edService.decryptUsingAES256(_u)).projects;
        const menu_temp: any[] = [];
        try {
            this.menu = JSON.parse(
                this.menu.filter(
                    (item: any) => item.project_id == Helper.ProjectID()
                )[0].menu_list
            );
            this.parent_menu = this.getDistinctMenuItems();
        } catch (error) { }

        if (
            this.document.location.hostname == 'localhost' &&
            this.currentUser.employee_type_id == 1 &&
            false
        ) {
            this.model = [
                {
                    label: 'Home',
                    items: [
                        {
                            label: 'Dashboard',
                            icon: 'pi pi-chart-bar',
                            routerLink: ['/dashboard'],
                        },
                    ],
                },
                {
                    label: 'Projects',
                    items: [
                        {
                            label: 'User',
                            icon: 'pi pi-user',
                            routerLink: ['/users'],
                        },
                        {
                            // label: 'Stores',
                            label: 'Shop',
                            icon: 'pi pi-home',
                            routerLink: ['/stores'],
                        },
                    ],
                },
                {
                    label: 'Settings',
                    items: [
                        {
                            label: 'POSM',
                            icon: 'pi pi-briefcase',
                            routerLink: ['/posm'],
                        },
                        {
                            label: 'OSA',
                            icon: 'pi pi-box',
                            routerLink: ['/osa'],
                        },
                        {
                            label: 'Plans',
                            icon: 'pi pi-calendar-plus',
                            routerLink: ['/plans'],
                        },
                        {
                            label: 'Survey',
                            icon: 'pi pi-table',
                            routerLink: ['/survey'],
                        },
                        // Promotion
                        {
                            label: 'Promotion',
                            icon: 'pi pi-table',
                            routerLink: ['/promo'],
                        }

                    ],
                },
                {
                    label: 'MASTER',
                    items: [
                        {
                            label: 'Product',
                            icon: 'pi pi-database',
                            routerLink: ['/osa/product'],
                        },
                        {
                            label: 'Category',
                            icon: 'pi pi-briefcase',
                            routerLink: ['/osa/product/category'],
                        },
                    ],
                },

                {
                    label: 'Reports',
                    items: [
                        {
                            label: 'Works',
                            icon: 'pi pi-list',
                            routerLink: ['/reports'],
                        },
                        // {
                        //     label: 'Compliance Feedback',
                        //     icon: 'pi pi-list',
                        //     routerLink: ['/Compliance-Feedback'],
                        // },
                    ],
                },

                {
                    label: '_______________________________________________',
                },
                {
                    label: 'UI Components',
                    items: [
                        {
                            label: 'Form Layout',
                            icon: 'pi pi-fw pi-id-card',
                            routerLink: ['/uikit/formlayout'],
                        },
                        {
                            label: 'Filter Control',
                            icon: 'pi pi-filter-fill',
                            routerLink: ['/uikit/filter'],
                        },
                        {
                            label: 'Input',
                            icon: 'pi pi-fw pi-check-square',
                            routerLink: ['/uikit/input'],
                        },
                        {
                            label: 'Float Label',
                            icon: 'pi pi-fw pi-bookmark',
                            routerLink: ['/uikit/floatlabel'],
                        },
                        {
                            label: 'Invalid State',
                            icon: 'pi pi-fw pi-exclamation-circle',
                            routerLink: ['/uikit/invalidstate'],
                        },
                        {
                            label: 'Button',
                            icon: 'pi pi-fw pi-box',
                            routerLink: ['/uikit/button'],
                        },
                        {
                            label: 'Table',
                            icon: 'pi pi-fw pi-table',
                            routerLink: ['/uikit/table'],
                        },
                        {
                            label: 'List',
                            icon: 'pi pi-fw pi-list',
                            routerLink: ['/uikit/list'],
                        },
                        {
                            label: 'Tree',
                            icon: 'pi pi-fw pi-share-alt',
                            routerLink: ['/uikit/tree'],
                        },
                        {
                            label: 'Panel',
                            icon: 'pi pi-fw pi-tablet',
                            routerLink: ['/uikit/panel'],
                        },
                        {
                            label: 'Overlay',
                            icon: 'pi pi-fw pi-clone',
                            routerLink: ['/uikit/overlay'],
                        },
                        {
                            label: 'Media',
                            icon: 'pi pi-fw pi-image',
                            routerLink: ['/uikit/media'],
                        },
                        {
                            label: 'Menu',
                            icon: 'pi pi-fw pi-bars',
                            routerLink: ['/uikit/menu'],
                            routerLinkActiveOptions: {
                                paths: 'subset',
                                queryParams: 'ignored',
                                matrixParams: 'ignored',
                                fragment: 'ignored',
                            },
                        },
                        {
                            label: 'Message',
                            icon: 'pi pi-fw pi-comment',
                            routerLink: ['/uikit/message'],
                        },
                        {
                            label: 'File',
                            icon: 'pi pi-fw pi-file',
                            routerLink: ['/uikit/file'],
                        },
                        {
                            label: 'Chart',
                            icon: 'pi pi-fw pi-chart-bar',
                            routerLink: ['/uikit/charts'],
                        },
                        {
                            label: 'Misc',
                            icon: 'pi pi-fw pi-circle',
                            routerLink: ['/uikit/misc'],
                        },
                    ],
                },
                {
                    label: 'Prime Blocks',
                    items: [
                        {
                            label: 'Free Blocks',
                            icon: 'pi pi-fw pi-eye',
                            routerLink: ['/blocks'],
                            badge: 'NEW',
                        },
                        {
                            label: 'All Blocks',
                            icon: 'pi pi-fw pi-globe',
                            url: ['https://www.primefaces.org/primeblocks-ng'],
                            target: '_blank',
                        },
                    ],
                },
                {
                    label: 'Utilities',
                    items: [
                        {
                            label: 'PrimeIcons',
                            icon: 'pi pi-fw pi-prime',
                            routerLink: ['/utilities/icons'],
                        },
                        {
                            label: 'PrimeFlex',
                            icon: 'pi pi-fw pi-desktop',
                            url: ['https://www.primefaces.org/primeflex/'],
                            target: '_blank',
                        },
                        {
                            label: 'PrimeNG',
                            icon: 'pi pi-fw pi-desktop',
                            url: ['https://primeng.org/'],
                            target: '_blank',
                        },
                    ],
                },
                {
                    label: 'Pages',
                    icon: 'pi pi-fw pi-briefcase',
                    items: [
                        {
                            label: 'Landing',
                            icon: 'pi pi-fw pi-globe',
                            routerLink: ['/landing'],
                        },
                        {
                            label: 'Auth',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'Login',
                                    icon: 'pi pi-fw pi-sign-in',
                                    routerLink: ['/auth/login'],
                                },
                                {
                                    label: 'Error',
                                    icon: 'pi pi-fw pi-times-circle',
                                    routerLink: ['/auth/error'],
                                },
                                {
                                    label: 'Access Denied',
                                    icon: 'pi pi-fw pi-lock',
                                    routerLink: ['/auth/access'],
                                },
                            ],
                        },
                        {
                            label: 'Crud',
                            icon: 'pi pi-fw pi-pencil',
                            routerLink: ['/crud'],
                        },
                        {
                            label: 'Timeline',
                            icon: 'pi pi-fw pi-calendar',
                            routerLink: ['/timeline'],
                        },
                        {
                            label: 'Not Found',
                            icon: 'pi pi-fw pi-exclamation-circle',
                            routerLink: ['/notfound'],
                        },
                        {
                            label: 'Empty',
                            icon: 'pi pi-fw pi-circle-off',
                            routerLink: ['/empty'],
                        },
                    ],
                },
                {
                    label: 'Hierarchy',
                    items: [
                        {
                            label: 'Submenu 1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                {
                                    label: 'Submenu 1.1',
                                    icon: 'pi pi-fw pi-bookmark',
                                    items: [
                                        {
                                            label: 'Submenu 1.1.1',
                                            icon: 'pi pi-fw pi-bookmark',
                                        },
                                        {
                                            label: 'Submenu 1.1.2',
                                            icon: 'pi pi-fw pi-bookmark',
                                        },
                                        {
                                            label: 'Submenu 1.1.3',
                                            icon: 'pi pi-fw pi-bookmark',
                                        },
                                    ],
                                },
                                {
                                    label: 'Submenu 1.2',
                                    icon: 'pi pi-fw pi-bookmark',
                                    items: [
                                        {
                                            label: 'Submenu 1.2.1',
                                            icon: 'pi pi-fw pi-bookmark',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            label: 'Submenu 2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                {
                                    label: 'Submenu 2.1',
                                    icon: 'pi pi-fw pi-bookmark',
                                    items: [
                                        {
                                            label: 'Submenu 2.1.1',
                                            icon: 'pi pi-fw pi-bookmark',
                                        },
                                        {
                                            label: 'Submenu 2.1.2',
                                            icon: 'pi pi-fw pi-bookmark',
                                        },
                                    ],
                                },
                                {
                                    label: 'Submenu 2.2',
                                    icon: 'pi pi-fw pi-bookmark',
                                    items: [
                                        {
                                            label: 'Submenu 2.2.1',
                                            icon: 'pi pi-fw pi-bookmark',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: 'Get Started',
                    items: [
                        {
                            label: 'Documentation',
                            icon: 'pi pi-fw pi-question',
                            routerLink: ['/documentation'],
                        },
                        {
                            label: 'View Source',
                            icon: 'pi pi-fw pi-search',
                            url: ['https://github.com/primefaces/sakai-ng'],
                            target: '_blank',
                        },
                    ],
                },
            ];
        } else {
            try {
                this.parent_menu.forEach((p: any) => {
                    const temp_item = this.menu.filter(
                        (m: any) =>
                            m.label_parent == p.label_parent && m.check == 1
                    );
                    if (temp_item.length > 0) {
                        const chill_menu: any = [];
                        temp_item.forEach((element: any) => {
                            if (environment.menu_key == 'routerLink') {
                                chill_menu.push({
                                    label: element.label,
                                    icon: element.icon,
                                    routerLink: [element.routerLink],
                                });
                            }
                            else if (environment.menu_key == 'proxy_link') {
                                chill_menu.push({
                                    label: element.label,
                                    icon: element.icon,
                                    url: [element.proxy_link],
                                    // target: '_blank',
                                    routerlink: element.routerModule
                                });
                            }
                            else {
                                chill_menu.push({
                                    label: element.label,
                                    icon: element.icon,
                                    url: [element.share_link],
                                    //target: '_blank',
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

            if (this.model.length == 0) {
                this.router.navigate(['/empty']);
            }
        }
        localStorage.setItem('menu', JSON.stringify(this.menu));
    }
}
