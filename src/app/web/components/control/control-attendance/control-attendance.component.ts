import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { FileService } from 'src/app/web/service/file.service';
import { ReportsService } from 'src/app/web/service/reports.service';
import { ShiftsService } from 'src/app/web/service/shifts.service';

@Component({
    selector: 'app-control-attendance',
    templateUrl: './control-attendance.component.html',
    styleUrls: ['./control-attendance.component.scss'],
})
export class ControlAttendanceComponent {
    @Input() inValue: any = [];
    @Output() outValue = new EventEmitter<any>();
    @Output() secondOutValue = new EventEmitter<any>();

    constructor(
        private _service: ReportsService,
        private shift_service: ShiftsService,
        private edService: EncryptDecryptService,
        private messageService: MessageService,
        private taskService: TaskFileService,
        private _file: FileService,
        private confirmationService: ConfirmationService
    ) {}
    images: any = [];
    responsiveOptions: any;
    project: any;
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter((d: any) => d.project_id == Helper.ProjectID())[0];
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.

        this.loadDataShift();
        this.loadUser();
        this.projectName();

        console.log('invalue', this.inValue);
        // Ca gãy
        this.LoadData();
        this.responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 5,
            },
            {
                breakpoint: '768px',
                numVisible: 3,
            },
            {
                breakpoint: '560px',
                numVisible: 1,
            },
        ];

        this.images = this._service.imageEmp || [];
        this._service.imageEmp = [];
    }

    activeIndex: number | undefined = 0;
    activeIndexChange(index: number) {
        this.activeIndex = index;
    }

    currentUser: any;
    permission_full = 0;
    loadUser() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.currentUser = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).employee[0];

        if (
            this.currentUser.employee_type_id == 1 ||
            this.currentUser.employee_type_id == 2 ||
            this.currentUser.employee_type_id == 3
        ) {
            this.permission_full = 1;
        } else {
            this.permission_full = 0;
        }
    }

    listShift: any = [];
    loadDataShift() {
        this.shift_service
            .ewo_GetShifts(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listShift = data.data;

                    this.listShift.forEach((s: any) => {
                        s.checkShow =
                            this.inValue.filter(
                                (f: any) => f.shift_id == s.shift_id
                            ).length > 0
                                ? 1
                                : 0;
                    });
                    this.listShift = this.listShift.filter(
                        (lf: any) => lf.checkShow == 1
                    );

                    this.listShift.forEach((s: any) => {
                        s.getItem = this.inValue.filter(
                            (f: any) =>
                                f.shift_id == s.shift_id ||
                                f.atd_type == 'OVERVIEW'
                        );
                        s.getItem = s.getItem.map((m: any) => ({
                            ...m,
                            header: `[${m.shift_code}] - ${m.note}`,
                            myInputImage: `myInputImage${m.atd_type}${m.shift_code}`,
                            nameInputFile: `Change Image ${m.atd_type}`,
                        }));

                        const listphoto: any = [];
                        for (var i = 0; i < s.getItem.length; i++) {
                            listphoto.push({
                                id: i + 1,
                                src: s.getItem[i].atd_photo,
                                title:
                                    s.getItem[i].atd_type +
                                    ': ' +
                                    s.getItem[i].atd_time,
                                image_time: s.getItem[i].atd_time,
                                _index: i + 1,
                            });
                        }
                        s.getItem.listphoto = listphoto;

                        let resultCheckOut = s.getItem.filter(
                            (f1: any) => f1.atd_type == 'CHECKOUT'
                        )[0];
                        let resultCheckIn = s.getItem.filter(
                            (f1: any) => f1.atd_type == 'CHECKIN'
                        )[0];

                        s.getItem.verify =
                            Helper.IsNull(
                                this.inValue.filter(
                                    (f: any) => f.atd_type == 'OVERVIEW'
                                )[0]
                            ) != true
                                ? this.inValue.filter(
                                      (f: any) => f.atd_type == 'OVERVIEW'
                                  )[0].verify
                                : null;

                        if (
                            Helper.IsNull(resultCheckOut) != true &&
                            Helper.IsNull(resultCheckIn) != true
                        ) {
                            s.getItem.time_in_store = Helper.time_in_store(
                                resultCheckIn.atd_time,
                                resultCheckIn.time,
                                resultCheckOut.atd_time,
                                resultCheckOut.time
                            );
                            s.getItem._longitudeCheckIn =
                                resultCheckIn.longitude;
                            s.getItem._latitudeCheckIn = resultCheckIn.latitude;
                            s.getItem._longitudeCheckOut =
                                resultCheckOut.longitude;
                            s.getItem._latitudeCheckOut =
                                resultCheckOut.latitude;
                        }
                    });
                }
            });
    }

    listATDShift = {
        r: [] as any,
        getItem: [] as any,
    };

    filterArray(list: any): any {
        return list.filter(
            (item: any, index: any, self: any) => self.indexOf(item) === index
        );
    }

    LoadData() {
        this.listATDShift.getItem = [];
        this.inValue.forEach((element: any, index: any) => {
            this.listATDShift.r.push(element.r);
        });
        this.listATDShift.r = this.filterArray(this.listATDShift.r);
        this.listATDShift.r.forEach((element: any, index: any) => {
            // || f.atd_type == 'OVERVIEW'
            this.listATDShift.getItem.push(
                this.inValue.filter((f: any) => f.r == element)
            );

            let resultCheckOut = this.inValue.filter(
                (f: any) => f.r == element && f.atd_type == 'CHECKOUT'
            )[0];
            let resultCheckIn = this.inValue.filter(
                (f: any) => f.r == element && f.atd_type == 'CHECKIN'
            )[0];

            this.listATDShift.getItem.forEach((item: any, index: any) => {
                const listphoto: any = [];
                for (var i = 0; i < item.length; i++) {
                    listphoto.push({
                        id: i + 1,
                        src: item[i].atd_photo,
                        title: item[i].atd_type + ': ' + item[i].atd_time,
                        image_time: item[i].atd_time,
                        _index: i + 1,
                    });
                }
                this.listATDShift.getItem[index].listphoto = listphoto;

                item.forEach((e: any) => {
                    if (e.atd_type != 'OVERVIEW') {
                        e.isBsc = e.request_id != null ? 1 : 0;
                    }
                });
            });

            this.listATDShift.getItem[index].shift_code =
                Helper.IsNull(resultCheckIn) != true
                    ? resultCheckIn.shift_code
                    : null;
            this.listATDShift.getItem[index].shift_note =
                Helper.IsNull(resultCheckIn) != true
                    ? resultCheckIn.note
                    : null;

            if (
                Helper.IsNull(resultCheckOut) != true &&
                Helper.IsNull(resultCheckIn) != true
            ) {
                this.listATDShift.getItem[index].time_in_store =
                    Helper.time_in_store(
                        resultCheckIn.atd_time,
                        resultCheckIn.time,
                        resultCheckOut.atd_time,
                        resultCheckOut.time
                    );
                this.listATDShift.getItem[index]._longitudeCheckIn =
                    resultCheckIn.longitude;
                this.listATDShift.getItem[index]._latitudeCheckIn =
                    resultCheckIn.latitude;
                this.listATDShift.getItem[index]._longitudeCheckOut =
                    resultCheckOut.longitude;
                this.listATDShift.getItem[index]._latitudeCheckOut =
                    resultCheckOut.latitude;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (changes['inValue'] && Helper.IsNull(this.inValue) != true) {
            this.loadDataShift();
            // // Ca gãy
            this.LoadData();
        }
    }

    getSrcMap(atd_type: any): any {
        switch (atd_type) {
            case 'CHECKIN':
                return '/assets/demo/images/works/marker_red.png';
            case 'CHECKOUT':
                return '/assets/demo/images/works/marker_blue.png';
            default:
                return '/assets/demo/images/works/home.png';
        }
    }

    listphoto: any = [];
    openImage(index: any, listphoto: any) {
        const changeindex = index;
        localStorage.setItem('listphoto', JSON.stringify(listphoto));
        localStorage.setItem('changeindex', JSON.stringify(changeindex));

        this.urlgallery = 'assets/ZoomImage/tool.html';
        document.open(
            <string>this.urlgallery,
            'image_default',
            'height=700,width=900,top=100,left= 539.647'
        );
    }

    onImageError(event: any, item: any) {
        const link_err = 'https://audit-api.acacy.vn/template/no_photo.jpg';
        item.atd_photo = link_err;
    }
    employee_image = EnumSystem.image_profile;
    onImageErrorProfile(event: any, item: any) {
        const link_err = EnumSystem.image_profile;
        item.employee_image = link_err;
    }

    urlgallery: any = null;
    mapPopup(lat: any, long: any) {
        this.urlgallery =
            'https://www.google.com/maps/search/' + lat + '+' + long;
        document.open(
            <string>this.urlgallery,
            'image_default',
            'height=700,width=900,top=100,left= 539.647'
        );
    }

    onUpdateAvatar(table: string, item: any) {
        let id = 0;
        let url = '';
        if (table == 'employee') {
            id = item.employee_id;
        }
        if (table == 'shop') {
            id = item.shop_id;
        }
        url = item.atd_photo;

        this._service
            .Report_ATD_ChooseImageEmployee(id, url, table)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (table == 'employee') {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Notification',
                            detail: 'Update avatars successfully',
                        });
                    }
                    if (table == 'shop') {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Notification',
                            detail: 'Update Image Overview Shop successfully',
                        });
                    }
                }
            });
    }

    NofiIsNull(value: any, name: any): any {
        if (Helper.IsNull(value) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            return 1;
        }
        return 0;
    }

    imageUpload!: any;
    onUploadImge(event: any, type: string, fulldata: any) {
        // console.log('type : ', type)
        // console.log('fulldata : ', fulldata)

        // this.clearFileInput(type, fulldata)
        // return;

        this.imageUpload = event.target.files[0];
        if (this.NofiIsNull(this.imageUpload, 'image') == 1) {
            return;
        } else {
            // let WriteLabel =
            //     fulldata.project_code + ' - ShopCode: ' + fulldata.shop_code;
            let WriteLabel = 'ShopCode: ' + fulldata.shop_code;

            this.taskService
                .ImageRender(this.imageUpload, this.imageUpload.name)
                .then((file) => {
                    this.imageUpload = file;

                    const formUploadImageBefore = new FormData();
                    formUploadImageBefore.append('files', this.imageUpload);
                    formUploadImageBefore.append('ImageType', type);
                    formUploadImageBefore.append('WriteLabel', WriteLabel);
                    // this._file
                    //     .UploadImage(formUploadImageBefore)
                    //     .subscribe((data: any) => {
                    //         if (data.result == EnumStatus.ok) {
                    //             let url = EnumSystem.fileLocal + data.data;

                    //             this._service
                    //                 .Report_ATDImage_Action(url, fulldata.id)
                    //                 .subscribe((data: any) => {
                    //                     if (data.result == EnumStatus.ok) {
                    //                         fulldata.atd_photo = url;
                    //                         this.clearFileInput(type, fulldata);
                    //                     }
                    //                 });
                    //         }
                    //     });

                    const fileName = AppComponent.generateGuid();
                    const newFile = new File(
                        [this.imageUpload],
                        fileName +
                            this.imageUpload.name.substring(
                                this.imageUpload.name.lastIndexOf('.')
                            ),
                        { type: this.imageUpload.type }
                    );
                    const modun = type;
                    this._file
                        .FileUpload(
                            newFile,
                            this.project.project_code,
                            modun,
                            WriteLabel
                        )
                        .subscribe(
                            (response: any) => {
                                let url = response.url;
                                this._service
                                    .Report_ATDImage_Action(url, fulldata.id)
                                    .subscribe((data: any) => {
                                        if (data.result == EnumStatus.ok) {
                                            fulldata.atd_photo = url;
                                            this.clearFileInput(type, fulldata);
                                        }
                                    });
                            },
                            (error: any) => {
                                console.error('Upload error:', error);
                            }
                        );
                });
        }
    }

    @ViewChild('myInputImage') myInputImage: any;

    clearFileInput(type: any, fulldata: any) {
        try {
            if (type == 'OVERVIEW') {
                const list = {
                    project_id: fulldata.project_id,
                    report_id: fulldata.report_id,
                };
                this.outValue.emit(list);
                this.loadDataShift();
                this.myInputImage.nativeElement.value = null;
            }
        } catch (error) {}
    }
    delete(event: Event, item: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn có chắc chắn muốn xóa chấm công này?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-sm',
            accept: () => {
                this._service
                    .Report_WKP_Action(Helper.ProjectID(), item.id)
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Thành công',
                                detail: 'Xóa chấm công thành công!',
                                life: 3000,
                            });
                            const list = {
                                report_id: this.inValue.report_id,
                            };
                            this.secondOutValue.emit(list);
                        }
                    });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Từ chối',
                    detail: 'Bạn đã từ chối',
                    life: 3000,
                });
            },
        });
    }
}
