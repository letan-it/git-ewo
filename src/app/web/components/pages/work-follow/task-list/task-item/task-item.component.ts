import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TasksService } from '../../service/tasks.service';
import { MessageService } from 'primeng/api';
import { EnumFolderFile, EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { AppComponent } from 'src/app/app.component';
import { FileService } from 'src/app/web/service/file.service';
import { Pf } from 'src/app/_helpers/pf';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
@Component({
    selector: 'app-task-item',
    templateUrl: './task-item.component.html',
    styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
    @Input() info_modal: any;
    @Output() reset = new EventEmitter<string>()
    task_code: string = '';
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        translate: 'no',
        placeholder: 'Enter text here...',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',
        sanitize: false,
        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText',
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
    };
    listTag: any = ['BackEnd', 'FontEnd', 'Data', 'API', 'APP', 'Tool', 'UXUI', 'RD', 'AR', '...']
    time: any
    data: any = {
        action: undefined,
        task_name: undefined,
        prioritize: null,
        tag: '',
        description: undefined,
        status: undefined,
        start_date: undefined,
        end_date: undefined,
        assignees: 0,
        team_follow: '',
    };
    error_class: any = {
        error: 0,
        task_name: 'none',
        tag: 'none',
        start_date: 'none',
        end_date: 'none',
        assignees: 'none',
    };
    list_file: any = [];
    filename: any;
    filepload: any;
    @ViewChild('myInput') myInput: any;
    constructor(
        private taskService: TasksService,
        private messageService: MessageService,
        private fileService: FileService,
        private edService: EncryptDecryptService,
    ) {

    }
    project:any 
    projectName () {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter(
            (d: any) => d.project_id == Helper.ProjectID()
        )[0];
        console.log(this.project);
    }

    ngOnInit() { 
        this.projectName ();
    }
    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        this.task_code = AppComponent.generateGuid();
    }
    removeItem(itemToRemove: any): void {
        this.list_file = this.list_file.filter(
            (item: any) => item.url !== itemToRemove
        );
    }
    onUploadFile(event: any) {
        this.filepload = event.target.files[0];

        if (this.filename == undefined || this.filename == '') {
            this.filename = this.filepload.name;
        }
        const formUploadImageBefore = new FormData();
        formUploadImageBefore.append('files', this.filepload);
        formUploadImageBefore.append('ImageType', 'TaskList');

        // this.fileService
        //     .UploadFile(formUploadImageBefore)
        //     .subscribe((data: any) => {
        //         if (data.result == EnumStatus.ok) {
        //             this.list_file.push({
        //                 file_name: this.filename,
        //                 url: EnumSystem.fileLocal + data.data,
        //             });
        //         }
        //         this.filename = undefined;
        //         this.filepload = undefined;
        //         try {
        //             this.myInput.nativeElement.value = null;
        //         } catch (error) { }
        //     });

            const fileName = AppComponent.generateGuid();
            const newFile = new File([this.filepload], fileName+this.filepload.name.substring(this.filepload.name.lastIndexOf('.')),{type: this.filepload.type});
            const modun = 'TASKLIST';
            const drawText = this.filename;
            this.fileService.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                (response : any) => {      

                    this.list_file.push({
                        file_name: this.filename,
                        url: response.url
                    });
                    this.filename = undefined;
                    this.filepload = undefined;
                    this.myInput.nativeElement.value = null;

                },
                (error : any) => { 
                    this.filename = undefined;
                    this.filepload = undefined;
                    this.myInput.nativeElement.value = null;
                }
            );

    }

    GetChip(item: any) {
        const data = this.data.tag.split(',').slice(0, -1)
        const check = item.toString()
        if (data.find((e: any) => e.replace(/ /g, '') == check)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Double tag',
            });
        } else {

            this.data.tag += item + ',';
        }
        // console.log(this.data.tag)
    }
    selectItem_user(event: any) {
        this.data.assignees = event;
    }
    selectItem_TeamUser(event: any) {

        try {
            const data = [] as any;
            event.forEach((element: any) => {
                if (element.code != this.data.assignees) data.push(element.code);
            });
            this.data.team_follow = data.join(',');
        } catch (error) {

        }

    }

    onCancel() {

        (this.data = {
            task_name: undefined,
            prioritize: null,
            tag: '',
            description: undefined,
            start_date: undefined,
            end_date: undefined,
            assignees: 0,
            team_follow: '',
        }),
            (this.info_modal = {
                visible: false,
                dataModel: this.data,
            });
        this.data.action = 'clear'
        this.error_class = {
            task_name: 'none',
            tag: 'none',
            start_date: 'none',
            end_date: 'none',
            assignees: 'none',
            error: 0,
        };
        this.list_file = []
        this.time = null
    }


    checkDate() {
        let check = 0
        if (this.time.some((e: any) => e == null)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a full Time',
            });
            check = 1
        }
        return check
    }



    onSave() {
        if (!this.data.tag.toString().endsWith(',')) {
            this.data.tag = this.data.tag + ', '
        }
        if (this.data.tag.toString().endsWith(',')) {
            this.data.tag = this.data.tag + ''
        }

        if (this.NofiIsNull(this.data.task_name, 'task name') == 1 ||
            this.NofiIsNull(this.data.tag, 'tag') == 1 ||
            this.NofiIsNull(this.time, 'time') == 1 ||
            this.NofiIsNull(this.data.assignees, 'assignees') == 1 ||

            this.checkDate() == 1) {
            return;
        } else {

            this.data.start_date = Helper.convertDate(new Date(this.time[0]))
            this.data.end_date = Helper.convertDate(new Date(this.time[1]))

            this.taskService
                .TaskList_Create(
                    this.data.task_name,
                    this.data.description ? this.data.description : '',
                    this.data.start_date,
                    this.data.end_date,
                    this.data.prioritize,
                    this.data.tag,
                    'ToDo',
                    '',
                    this.data.assignees,
                    this.data.team_follow,
                    this.task_code
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (this.list_file.length > 0) {
                            const param = {
                                item_data: "TaskList",
                                item_id: this.task_code,
                                data: this.list_file
                            };
                            this.taskService
                                .TaskList_UploadFile(param)
                                .subscribe((up: any) => {

                                });
                        }
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Notification',
                            detail: 'Created successfully',
                        });
                        this.reset.emit()
                        this.onCancel()
                        this.data.action = 'clear'
                    }
                });
        }

    }

    NofiResult(page: any, action: any, name: any, severity: any, summary: any) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: name,
            life: 3000,
        });

        AppComponent.pushMsg(
            page,
            action,
            name,
            severity == 'success' ? EnumStatus.ok : EnumStatus.error,
            0
        );

    }
    NofiIsNull(value: any, name: any): any {
        let check = 0;
        if (value == ',') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            check = 1;
        }
        if (Helper.IsNull(value) == true || Pf.checkSpace(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            check = 1;
        }
        return check;
    }



}
