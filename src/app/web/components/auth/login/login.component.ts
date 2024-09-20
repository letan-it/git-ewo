import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastModule } from 'primeng/toast';
import { Message, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { AppComponent } from 'src/app/app.component';
import {
    EnumAction,
    EnumLocalStorage,
    EnumStatus,
    EnumSystem,
} from 'src/app/Core/_enum';
import { UserService } from 'src/app/web/service/user.service';
import { Helper } from 'src/app/Core/_helper';
import { NodeService } from 'src/app/web/service/node.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [MessageService],
})
export class LoginComponent {
    valCheck: string[] = ['remember'];

    password!: string;
    username: string = '';

    onSomeAction($event: any) {
        if ($event.keyCode === 13) {
            this.onSubmit();
        }
    }
    constructor(
        public layoutService: LayoutService,
        private messageService: MessageService,
        private router: Router,
        private _edCrypt: EncryptDecryptService,
        private userService: UserService,
        private nodeService: NodeService,
        private masterService: MastersService,
        private titleService: Title
    ) { }
    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }
    returnClassBg() {
        const nowDate = new Date();
        const dateNow = this.getFormatedDate(nowDate, 'YYYY-MM-dd');
        
        if (dateNow == '2024-09-17') {
            //TRUNG THU
            return 'vh-100 bg-trungthu';
        }
        else if (dateNow == '2024-12-24' || dateNow == '2024-12-25') {
            //NOEL
            return 'vh-100 bg-noel';
        }
        else {
            return 'vh-100';
        }
    }
    msgsInfo: Message[] = [];

    version: any;
    changeFavicon(iconUrl: string): void {
        const link: HTMLLinkElement =
            document.querySelector("link[rel*='icon']") ||
            document.createElement('link');
        link.type = 'image/png';
        link.rel = 'shortcut icon';
        link.href = iconUrl;
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.

        let theme = localStorage.getItem('theme-config');

        //localStorage.clear();
        for (let key in localStorage) {
            if (
                key !== '_p' &&
                key !== 'titleService' &&
                key !== 'imageService'
            ) {
                localStorage.removeItem(key);
            }
        }
        localStorage.setItem('theme-config', theme + '');
        this.version = environment.version;

        this.titleService.setTitle('ACACY');
        try {
            const titleService = localStorage.getItem('titleService');
            const imageService = localStorage.getItem('imageService');
            if (titleService != null)
                this.titleService.setTitle(titleService + '');
            if (imageService != null) {
                this.changeFavicon(imageService);
            }
        } catch (error) {}
    }
    user_current: any;
    iserror: boolean = false;

    display: boolean = false;
    message: string = '';

    onSubmit() {
        this.iserror = false;
        if (Helper.IsNull(this.username) == true) {
            // this.show('Please enter the username');
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter the username',
                life: 3000,
            });
            this.iserror = true;
            return;
        }
        if (Helper.IsNull(this.password) == true) {
            // this.show('Please enter the password');
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter the password',
                life: 3000,
            });
            this.iserror = true;
            return;
        }
        this.userService
            .login(this.username, this.password)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.user_current = data.data;
                    const userEncrypt = this._edCrypt.encryptUsingAES256(
                        JSON.stringify(this.user_current.employee[0])
                    );

                    localStorage.setItem(
                        EnumLocalStorage.user_profile,
                        userEncrypt
                    );

                    const dataEncrypt = this._edCrypt.encryptUsingAES256(
                        JSON.stringify(this.user_current)
                    );

                    localStorage.setItem(EnumLocalStorage.user, dataEncrypt);

                    const project = this.user_current.projects.filter(
                        (p: any) => p.project_id == Helper.ProjectID()
                    );

                    if (project.length > 0) {
                        localStorage.setItem(
                            'permission_button',
                            JSON.stringify(project[0])
                        );
                        if (
                            this.user_current.employee[0].action ==
                            EnumAction.change_password
                        ) {
                            this.router.navigate(['/auth/change-password']);
                        } else {
                            // (this.message = 'Hello, wish you a good day'),
                            //     (this.display = true);

                            AppComponent.pushMsg(
                                'System',
                                'current',
                                'Hello, wish you a good day',
                                EnumStatus.info,
                                0
                            );
                            try {
                                const id = AppComponent.generateGuid();
                                localStorage.setItem('id_Connect', id);
                                this.nodeService
                                    .PostMessage(
                                        'string',
                                        'system_' + id,
                                        this.user_current.employee[0].employee_id.toString(),
                                        'login_action' +
                                            window.location.hostname
                                    )
                                    .subscribe((data) => {
                                        // console.log(data);
                                    });
                            } catch (error) {}
                            this.masterService
                                .ewo_GetLanguage(Helper.ProjectID())
                                .subscribe((data: any) => {
                                    if (data.result == EnumStatus.ok) {
                                        localStorage.setItem(
                                            'key_language',
                                            'en'
                                        );
                                        localStorage.setItem(
                                            'language',
                                            JSON.stringify(data.data)
                                        );
                                    }
                                    // this.RouterNavigate(this.user_current.employee[0])
                                });
                            this.OK();
                        }
                    } else {
                        this.show('No project decentralization');
                    }
                } else {
                    (this.message = 'Wrong login information'),
                        (this.display = true);
                    this.iserror = true;
                }
            });
    }
    RouterNavigate(employee_id: any) {
        var menuList = JSON.parse(
            this.user_current.projects.filter(
                (project: any) => project.project_id == Helper.ProjectID()
            )[0].menu_list
        );
        var menu = JSON.parse(
            this.user_current.projects.filter(
                (project: any) => project.project_id == Helper.ProjectID()
            )[0].menu_list
        )[0];

        // this.router.navigate([menu.routerLink]);
        menuList.filter((f: any) => f.routerLink == '/reports').length > 0
            ? this.router.navigate(['/reports'])
            : this.router.navigate([menu.routerLink]);
    }

    show(mess: string, type: string = 'warn') {
        this.messageService.add({
            severity: 'warn',
            summary: EnumSystem.Notification,
            detail: mess,
            life: 3000,
        });
    }

    OK() {
        this.display = false;

        var menuList = JSON.parse(
            this.user_current!.projects.filter(
                (project: any) => project.project_id == Helper.ProjectID()
            )[0].menu_list
        );
        var menu = JSON.parse(
            this.user_current!.projects.filter(
                (project: any) => project.project_id == Helper.ProjectID()
            )[0].menu_list
        )[0];

        localStorage.setItem('menu', JSON.stringify(menu));
        // console.log('menuList : ', menuList)
        // console.log('menu : ', menu)

        if (environment.menu_key == 'proxy_link') {
            // this.router.navigate(['/reports']);
            menuList.filter((f: any) => f.routerLink == '/reports').length > 0
                ? this.router.navigate(['/reports'])
                : this.router.navigate([menu.routerLink]);
            this.display = false;
        } else {
            if (this.iserror == false) {
                // this.router.navigate(['/dashboard']);
                menuList.filter((f: any) => f.routerLink == '/reports').length >
                0
                    ? this.router.navigate(['/reports'])
                    : this.router.navigate([menu.routerLink]);
                this.display = false;
            } else {
                this.display = false;
            }
        }
    }
}
