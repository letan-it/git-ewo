import { Component, HostListener, OnInit } from '@angular/core';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { LayoutService } from './layout/service/app.layout.service';
import { Router } from '@angular/router';
import { EncryptDecryptService } from './Service/encrypt-decrypt.service';
import { formatDate } from '@angular/common';
import { EnumLocalStorage, EnumStatus, EnumSystem } from './Core/_enum';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Helper } from './Core/_helper';
import * as signalR from '@microsoft/signalr'; // npm i @microsoft/signalr@6.0.10 --force
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr'; //npm i @aspnet/signalr@1.0.27 --force
import { MastersService } from './web/service/masters.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [],
})
export class AppComponent implements OnInit {
    project: any;
    private _hubConnection: any = HubConnection;
    constructor(
        private primengConfig: PrimeNGConfig,
        public _router: Router,
        private EDService: EncryptDecryptService,
        private messageService: MessageService,
        private titleService: Title,
        private edService: EncryptDecryptService,
        public layoutService: LayoutService,
        private _masterService: MastersService
        
    ) {
        try {
           
            
           
                this._masterService.GetDomain().subscribe((data:any) => {
                    if (data.result == EnumStatus.ok) {
                        const hostname = window.location.hostname
                        const project = data.data.filter((p: any) => p.host_name == hostname)[0]
                        let project_id =  0;
                        if (project != null) {
                            project_id= project.project_id
                        }
                      
                        localStorage.setItem('_p', this.edService.encryptUsingAES256(project_id))
    
                    }
                })
            

          
        } catch (error) {
            
        }

      
    }

    @HostListener('mousewheel', ['$event'])
    onMouseWheel(event: MouseEvent) {
        if (event.ctrlKey == true) {
            event.preventDefault();
        }
    }
    windowScrolled = false;
    scrollToTop(): void {
        window.scrollTo(0, 0);
    }
    theme: any;

    private show(mess: string, type: string = 'success') {
        this.messageService.add({
            severity: type,
            summary: EnumSystem.Notification,
            detail: mess,
            life: 3000,
        });
    }

    displayFinder: boolean | undefined;
    items: any;
    menuMode: any;
    srcLink: any;
    pageLogin: number = 0;
    msgsSignalr: MessageSignalr[] = [];
    visible: boolean = false;
    message_signalr: any;
    showDialog() {
        this.visible = true;
    }
    public static notifyWindows(message: string) {
        if (!('Notification' in window)) {
            // Check if the browser supports notifications
            //alert('This browser does not support desktop notification');
        } else if (Notification.permission === 'granted') {
            // Check whether notification permissions have already been granted;
            // if so, create a notification
            const notification = new Notification(message);
            // …
        } else if (Notification.permission !== 'denied') {
            // We need to ask the user for permission
            Notification.requestPermission().then((permission) => {
                // If the user accepts, let's create a notification
                if (permission === 'granted') {
                    const notification = new Notification(message);
                    // …
                }
            });
        }
    }
    id_Connect: any;
    changeFavicon(iconUrl: string): void {
        const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/png';
        link.rel = 'shortcut icon';
        link.href = iconUrl;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    ngOnInit() {
       

        
        this.titleService.setTitle(
            `ACACY`
         );
        try {
            this.loadUser();
            //if (window.location.hostname == 'localhost') 
            if(true)
            { 
            this._hubConnection = new HubConnectionBuilder()
                .withUrl(EnumSystem.signalR_URL)
                .configureLogging(LogLevel.Information)
                .build();
            this._hubConnection
                .start()
                .then((data: any) => {
                    console.log('Connection started!');
                })
                .catch((err: any) =>
                    console.log('Error while establishing connection :(')
                );
                


            this._hubConnection.on(
                'BroadcastMessage',
                (data: MessageSignalr) => {
                    this.msgsSignalr.push(data);

                    try {
                        const id = localStorage.getItem('id_Connect');
                        const toMes = data.to;
                        const fromMes = data.from;
                        this.message_signalr = data.message;
                        if (toMes == 'system' && fromMes == '') {
                            // AppComponent.notifyWindows(
                            //     toMes + ': ' + data.message
                            // );
                            AppComponent.pushMsg(
                                fromMes,
                                toMes,
                                data.message,
                                'info',
                                1,
                                undefined
                            );
                            this.showDialog();
                        }
                        else if (toMes == this.userProfile.employee_id && fromMes.includes("system_") && data.message.includes("login_action") && fromMes !=  "system_"+id) {
                            const nowDate = new Date();
                           
                                alert("Cảnh báo đăng nhập\r\nTài khoản này vừa đăng nhập ở 1 thiết bị khác (" + data.message.replace("login_action", '') + ")" )
                                if (this.userProfile.employee_id != 10000) {
                                    setTimeout(() => {
                                        this._router.navigate(['/auth/login']);
                                    }, 20000);
                                }
                                
                           
                        }
                        else if (fromMes == this.userProfile.employee_id) {
                            // AppComponent.notifyWindows(
                            //     toMes + ': ' + data.message
                             
                                AppComponent.pushMsg(
                                    fromMes,
                                    toMes,
                                    data.message,
                                    'info',
                                    1,
                                    undefined
                                ); 
                            
                            
                            this.showDialog();
                        }
                       
                        else {
                            try {
                               
                                    console.log(data);
                                
                            } catch (error) { }
                             
                            
                        }

                    } catch (error) {}
                }
            );

        }

        } catch (error) {}
        if (window.location.pathname == '/auth/login') {
            this.pageLogin = 1;
        }
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

        try {
            if (
                localStorage.getItem(EnumLocalStorage.user_profile) ==
                EnumSystem.current
            ) {
                let _u = localStorage.getItem(EnumLocalStorage.user);
                if (_u == null) {
                    this._router.navigate(['/auth/login']);
                }
            }
        } catch (error) {}

        this.primengConfig.ripple = true;
        window.addEventListener('scroll', () => {
            this.windowScrolled = window.pageYOffset !== 0;
        });
        window.addEventListener('offline', () => {
            this.show('Internet Disconnection', EnumStatus.danger);
        });
        window.addEventListener('online', () => {
            this.show('Internet Connection', EnumStatus.success);
            // this.ConnectHub();
        });


        try {
            let _u = localStorage.getItem(EnumLocalStorage.user);

            this.project = JSON.parse(
                this.EDService.decryptUsingAES256(_u)
            ).projects.filter(
                (d: any) => d.project_id == Helper.ProjectID()
            )[0];
            
           
             
            

            this.titleService.setTitle(
                `${this.project.project_name}: ${environment.version}`
            );
            this.changeFavicon(this.project.image)
            
            
            localStorage.setItem('titleService',  `${this.project.project_name}`)
            localStorage.setItem('imageService',  `${this.project.image}`)
        } catch (error) {
            this.titleService.setTitle(
                'ACACY: ' + environment.version
            );
        }
    }
    public static generateGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            }
        );
    }
    user_profile: any;
    currentUser: any;
    userProfile: any;

    loadUser() {
        let _u = localStorage.getItem(EnumLocalStorage.user);

        this.currentUser = JSON.parse(this.edService.decryptUsingAES256(_u));
        this.currentUser.employee[0]._status =
            this.currentUser.employee[0].status == 1 ? true : false;
        this.userProfile = this.currentUser.employee[0];
    }

    public static pushMsg(
        from: any = 'System',
        to: any = 'current',
        message: string,
        type: string,
        isRead: number,
        content?: string
    ) {
        from == null ? (from = EnumSystem.system) : from;
        to == null ? (to = EnumSystem.current) : to;
        if (
            (localStorage.getItem(EnumLocalStorage.message) as string) == null
        ) {
            localStorage.setItem(EnumLocalStorage.message, '[]');
        }
        const msgLocal = JSON.parse(
            localStorage.getItem(EnumLocalStorage.message) as string
        );
        msgLocal.push({
            message: message,
            timestamp: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss a', 'en'),
            id: this.generateGuid(),
            from: from,
            to: to,
            type: type,
            isRead: isRead,
            content: content,
        });
        localStorage.setItem(
            EnumLocalStorage.message,
            JSON.stringify(msgLocal)
        );
    }
}

export interface MessageSignalr {
    from: string;
    to: string;
    timestamp: string;
    message: string;
}
