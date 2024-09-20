import { Component, Input } from '@angular/core';
import { AppConfig, LayoutService } from '../service/app.layout.service';
import { MenuService } from '../app.menu.service';
import { EnumLocalStorage } from 'src/app/Core/_enum';
import { state } from '@angular/animations';

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
})
export class AppConfigComponent {
    @Input() minimal: boolean = false;

    scales: number[] = [8,9,10, 11, 12, 13, 14, 15];
    theme: any;
    langMode: any = 'en'
    ChangeLanguage(event:any) {
        localStorage.setItem('key_language', this.langMode)
      
    }
    constructor(
        public layoutService: LayoutService,
        public menuService: MenuService
    ) {
        try {
            this.theme = JSON.parse(
                localStorage.getItem(EnumLocalStorage.theme_config) as string
            );
            if (this.theme == null) {
                this.theme = {
                    ...this.theme,
                    config: {
                        ripple: false,
                        inputStyle: 'outlined',
                        menuMode: 'overlay',
                        colorScheme: 'light',
                        theme: 'lara-light-indigo',
                        scale: 11,
                    },
                    state: {
                        staticMenuDesktopInactive: false,
                        overlayMenuActive: false,
                        profileSidebarVisible: false,
                        configSidebarVisible: false,
                        staticMenuMobileActive: false,
                        menuHoverActive: false,
                    },
                };
                localStorage.setItem(
                    EnumLocalStorage.theme_config,
                    JSON.stringify(this.theme)
                );
            }
            this.applyTheme();
        } catch (error) {}
    }
    saveTheme(theme: any) {
        localStorage.setItem(
            EnumLocalStorage.theme_config,
            JSON.stringify(this.theme)
        );
    }
    applyTheme() {
        this.layoutService.config = this.theme.config;
        this.layoutService.state = this.theme.state;
        this.applyScale();
        const theme = this.layoutService.config.theme;
        const colorScheme = this.layoutService.config.colorScheme;
        const newHref = 'assets/layout/styles/theme/' + theme + '/theme.css';
        this.replaceThemeLink(newHref, () => {
            this.layoutService.config.theme = theme;
            this.layoutService.config.colorScheme = colorScheme;
            this.layoutService.onConfigUpdate();
        });
    }

    ngOnInit(): void {}
    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
        this.theme.state.theme = _val;
        this.saveTheme(this.theme);
    }

    get scale(): number {
        return this.layoutService.config.scale;
    }

    set scale(_val: number) {
        this.layoutService.config.scale = _val;
    }

     
    get menuMode(): string {
        return this.layoutService.config.menuMode;
    }

    set menuMode(_val: string) {
        this.theme.config.menuMode = _val;
        this.saveTheme(this.theme);
        this.layoutService.config.menuMode = _val;
    }

    get inputStyle(): string {
        return this.layoutService.config.inputStyle;
    }

    set inputStyle(_val: string) {
        this.theme.config.inputStyle = _val;
        this.saveTheme(this.theme);
        this.layoutService.config.inputStyle = _val;
    }

    get ripple(): boolean {
        return this.layoutService.config.ripple;
    }

    set ripple(_val: boolean) {
        this.theme.config.ripple = _val;
        this.saveTheme(this.theme);
        this.layoutService.config.ripple = _val;
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    changeTheme(theme: string, colorScheme: string) {
        // this.theme.config.theme = theme;
        // this.theme.config.colorScheme = colorScheme;
        // this.saveTheme(this.theme);

        //this.loadtheme();
        //const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        // const newHref = themeLink
        //     .getAttribute('href')!
        //     .replace(this.layoutService.config.theme, theme);

        const newHref = 'assets/layout/styles/theme/' + theme + '/theme.css';
        this.replaceThemeLink(newHref, () => {
            this.layoutService.config.theme = theme;
            this.layoutService.config.colorScheme = colorScheme;
            this.theme.config.theme = theme;
            this.theme.config.colorScheme = colorScheme;
            this.saveTheme(this.theme);
            this.layoutService.onConfigUpdate();
        });
    }

    replaceThemeLink(href: string, onComplete: Function) {
        const id = 'theme-css';
        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        themeLink.parentNode!.insertBefore(
            cloneLinkElement,
            themeLink.nextSibling
        );

        cloneLinkElement.addEventListener('load', () => {
            themeLink.remove();
            cloneLinkElement.setAttribute('id', id);
            onComplete();
        });
    }

    decrementScale() {
        this.scale--;
        this.theme.config.scale = this.scale;
        this.saveTheme(this.theme);
        this.applyScale();
    }

    incrementScale() {
        this.scale++;
        this.theme.config.scale = this.scale;
        this.saveTheme(this.theme);
        this.applyScale();
    }

    applyScale() {
        document.documentElement.style.fontSize = this.scale + 'px';
    }
}
