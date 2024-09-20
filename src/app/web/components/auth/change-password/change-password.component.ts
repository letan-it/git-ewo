import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { AppComponent } from 'src/app/app.component';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { EmployeesService } from 'src/app/web/service/employees.service';
import { UserService } from 'src/app/web/service/user.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    providers: [MessageService],
})
export class ChangePassWordComponent {
    password1!: string;
    password2!: string;
    iserror: boolean = true;
    constructor(
        public layoutService: LayoutService,
        private messageService: MessageService,
        private router: Router,
        private edService: EncryptDecryptService,
        private userService: UserService,
        private employeesService: EmployeesService,
    ) { }
    currentUser: any;
    user_profile: string = 'current';
    userProfile: any;
    password_old!: string;
    confirmPassword!: string;
    password!: string;


    msgsInfo: Message[] = [];

    ngOnInit(): void {

        // let _u = localStorage.getItem(EnumLocalStorage.user);
        // this.currentUser = JSON.parse(this.edService.decryptUsingAES256(_u));

    }


    Change_Password() {

        try {

            let _u = localStorage.getItem(EnumLocalStorage.user);
            this.currentUser = JSON.parse(
                this.edService.decryptUsingAES256(_u)
            );

            this.userProfile = this.currentUser.employee[0];

        } catch (error) {

        }

        if (Helper.IsNull(this.password) == true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a password',
                life: 3000,
            });
            return;

        }
        if (Helper.IsNull(this.confirmPassword) == true) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Please enter a confirmPassword',
                life: 3000,
            });
            return;

        }

        if (this.userProfile.passEncrypt == this.password) {
            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'The password is the same as the old password',
                life: 3000,
            });

            return;
        }

        if (this.password != this.confirmPassword) {

            this.msgsInfo = [];

            this.msgsInfo.push({
                severity: EnumStatus.warning,
                summary: EnumSystem.Notification,
                detail: 'Password and confirm password do not match',
                life: 3000,
            });
            return;

        }

        this.employeesService
            .ewo_ChangePassWord(this.userProfile.login_name, this.password)
            .subscribe((data: any) => {

                if (data.result == EnumStatus.ok) {
                    this.display = true;
                    this.message = 'Change the password successfully, ' + this.password;
                    this.iserror = false;
                }
                AppComponent.pushMsg(
                    'Page Change Password',
                    'Change the password',
                    'Change the password successfully, ' + this.password,
                    EnumStatus.info,
                    0
                );

            });
    }

    onSomeAction($event: any) {
        if ($event.keyCode === 13) {
            this.Change_Password();
        }
    }
    display: boolean = false;
    message: string = '';

    show(mess: string, type: string = 'warn') {
        this.messageService.add({
            severity: 'warn',
            summary: EnumSystem.Notification,
            detail: mess,
            life: 3000,
        });
    }

    OK() {
        if (this.iserror == false)
            this.router.navigate(['/auth/login']);
        // return;
        else {
            this.display = false;
        }
    }

}
