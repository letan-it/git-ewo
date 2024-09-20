import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { MastersService } from 'src/app/web/service/masters.service';

@Component({
    selector: 'app-language-setting',
    templateUrl: './language-setting.component.html',
    styleUrls: ['./language-setting.component.scss'],
    providers: [MessageService],
})
export class LanguageSettingComponent {
    items_menu: any = [
        { label: ' MASTER' },
        { label: ' Language', icon: 'pi pi-language' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    menu_id = 59;
    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }
    constructor(
        private masterService: MastersService,
        private messageService: MessageService,
        private router: Router
    ) {}
    filteredlang: any | undefined;

    listLanguage!: any[];
    cols!: any[];
    setupTable() {
        this.cols = [
            { field: 'key', header: 'key' },
            { field: 'en', header: 'EN' },
            { field: 'vn', header: 'VN' },
            { field: 'created_date', header: 'Created Date' },
        ];
    }
    key_language: string = '';
    key_en: string = '';
    key_vn: string = '';
    select(key: string, en: string, vn: string) {
        this.key_language = key;
        this.key_en = en;
        this.key_vn = vn;
    }

    delete(key: string) {
        this.masterService
            .ewo_Language_Action(Helper.ProjectID(), key, '.del', '.del')
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.key_language = '';
                    this.key_en = '';
                    this.key_vn = '';
                    this.loadLanguage();
                }
            });
    }
    submit() {
        if (Helper.IsNull(this.key_language)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a key_language',
            });
            return;
        }
        if (Helper.IsNull(this.key_en)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a key_en',
            });
            return;
        }
        if (Helper.IsNull(this.key_vn)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a key_vn',
            });
            return;
        }
        this.masterService
            .ewo_Language_Action(
                Helper.ProjectID(),
                this.key_language.trim(),
                this.key_en,
                this.key_vn
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.key_language = '';
                    this.key_en = '';
                    this.key_vn = '';
                    this.loadLanguage();
                }
            });
    }
    loadLanguage() {
        this.masterService
            .ewo_GetLanguage(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    console.log(data.data);
                    this.listLanguage = data.data;
                    localStorage.setItem('language', JSON.stringify(data.data));
                }
            });
    }

    ngOnInit(): void {
        this.setupTable();
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
      this.loadLanguage();
      this.check_permissions()
    }
}
