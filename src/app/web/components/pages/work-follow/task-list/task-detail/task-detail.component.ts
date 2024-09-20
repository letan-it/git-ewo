import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { FileService } from 'src/app/web/service/file.service';
import { TasksService } from '../../service/tasks.service';
import { Pf } from 'src/app/_helpers/pf';
import { Helper } from 'src/app/Core/_helper';
import { MessageService } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnChanges {
  @Input() item_work: any = []
  @Output() closeDetail = new EventEmitter<string>()
  @ViewChild('myInput') myInput: any;
  success: any;
  e: any;
  constructor(private fileService: FileService,
     private _service: TasksService, 
     private messageService: MessageService,
     private edService: EncryptDecryptService,) { }


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
  align = 'alternate'
  team!: any
  data: any = {
    task_name: null,
    prioritize: null,
    tag: '',
    description: null,
    status: null,
    testing_status: " ",
    start_date: null,
    end_date: null,
    assignees: 0,
    team_follow: null,
    filename: null,
    task_code: null
  }
  newNote: any
  file: any = {
    fileName: '',
    url: ''
  }
  listTag: any = ['BackEnd', 'FontEnd', 'Data', 'API', 'APP', 'Tool', 'UXUI', 'RD', 'AR', '...']
  time: any


  zoomVisible: boolean = false
  dataZoom = {
    visibleNote: false,
    dataNote: null,
    editorConfig: this.editorConfig
  }
  list_file: any;
  filename: any;
  filepload: any = null
  testStatus: any
  status: any

  checkUpdate: number = 0
  removeList: any
  updateFile: any
  events: any = [
    {
      date: null,
      status: null,
      icon: null,
      task_name: null,
      tag: null
    }
  ]


  note = [
    {
      name: null,
      note: null,
      time: null
    }
  ]


  data_work = {
    file: [null],
    history: [null],
    note: [null],
    task: [null]
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
    if (changes['item_work']) {
      const res = this.item_work
      this.getData(res)

    }
  }

  showDescription: boolean = true
  showDescript() {
    this.showDescription = !this.showDescription
  }


  getData(e: any) {
    this._service.TaskList_GetItem(e?.task_id ? e.task_id : 0).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.data_work = {
          file: data.data?.files,
          history: data.data?.history,
          note: data.data?.note,
          task: data.data?.task
        }
        this.getDataItem()


      }
    })

  }


  dataHistory: any
  showHistory: boolean = true

  pageHistory(e: any) {
    if (e == 0) {
      this.dataHistory = this.events.slice(0, 1)
      this.showHistory = false
    } else {
      this.dataHistory = this.events
      this.showHistory = true
    }
  }

  action: any = ''
  noteItem: any = [{
    name: null,
    note: null,
    time: null
  }]
  showNoteItem: boolean = true
  pageNote(e: any) {
    if (e == 0) {
      this.noteItem = this.note.slice(1, 4)
      this.showNoteItem = false
    } else {
      this.noteItem = this.note.slice(1, this.note.length)
      this.showNoteItem = true
    }
  }


  getDataItem() {
    this.action = ''
    // task
    this.data_work?.task?.map((e: any) => {
      this.data = {
        task_name: e.task_name,
        prioritize: e.prioritize,
        tag: e.tag,
        description: e.description,
        status: e.status,
        start_date: e.start_date,
        end_date: e.end_date,
        assignees: e.assignees,
        team_follow: e.team_follow,
        testing_status: e.testing_status,
        task_code: e.task_code
      }
      this.status = this.data.status
      this.testStatus = this.data.testing_status
      this.filename = this.data.filename
      this.team = this.data.team_follow
      this.time = [new Date(this.data.start_date), new Date(this.data.end_date)]


    })

    // file
    this.list_file = []
    this.data_work?.file?.map((e: any) => {

      this.list_file.push({
        file_name: e.file_name,
        url: e.url
      })
    })

    // history
    this.events = []
    this.data_work?.history?.map((e: any) => {
      this.events.push({ date: e.created_date, status: e.status, icon: 'pi pi-file-edit', assignees_name: e.created_by_name })
    })

    this.events.reverse()



    this.pageHistory(0)

    // note
    this.note = []
    this.data_work?.note?.map((e: any) => {
      this.note.push({
        name: e.created_by_name,
        note: e.note,
        time: e.created_date
      })
    })
    this.note.reverse()
    const noteUpdate = this.note.slice(0, 1)
    this.newNote = null
    if (noteUpdate.length > 0) {
      this.newNote = noteUpdate[0].note
      this.dataZoom.dataNote = noteUpdate[0].note
    }
    this.pageNote(0)

  }


  selectItem_TesingStatus(e: any) {
    this.data.testing_status = e
  }

  selectItem_Status(e: any) {
    this.data.status = e
  }

  GetChip(item: any) {
    console.log(typeof this.data.tag);
    const data = this.data.tag.split(',').slice(0, -1);
    const check = item.toString()
    if (data.find((e: any) => e.replace(/ /g, '') == check)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Double tag',
      });
    } else {

      this.data.tag += ' ' + item + ',';
    }

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

  onUploadFile(event: any) {
    this.updateFile = []
    this.filepload = event.target.files[0];

    if (this.filepload) {
      this.checkUpdate = 1
    }

    if (this.filename == undefined || this.filename == '') {
      this.filename = this.filepload.name;
    }
    const formUploadImageBefore = new FormData();
    formUploadImageBefore.append('files', this.filepload);
    formUploadImageBefore.append('ImageType', 'TaskList');

    // this.fileService
    //   .UploadFile(formUploadImageBefore)
    //   .subscribe((data: any) => {
    //     if (data.result == EnumStatus.ok) {
    //       this.list_file.push({
    //         file_name: this.filename,
    //         url: EnumSystem.fileLocal + data.data,
    //       });
    //       this.updateFile.push({
    //         file_name: this.filename,
    //         url: EnumSystem.fileLocal + data.data,
    //       });

    //     }
    //     this.filename = undefined;
    //     this.filepload = undefined;
    //     try {
    //       this.myInput.nativeElement.value = null;
    //     } catch (error) { }
    //   });


      const fileName = AppComponent.generateGuid();
      const newFile = new File([this.filepload], fileName+this.filepload.name.substring(this.filepload.name.lastIndexOf('.')),{type: this.filepload.type});
      const modun = 'TASKLIST';
      const drawText =  this.filename;
      this.fileService.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
          (response : any) => {       

              this.list_file.push({
                file_name: this.filename,
                url: response.url
              });
              this.updateFile.push({
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





  removeItem(itemToRemove: any): void {
    this.removeList = this.list_file.filter(
      (e: any) => e.url == itemToRemove
    );
    this.list_file = this.list_file.filter(
      (item: any) => item.url !== itemToRemove
    );

  }




  HandleUpdate() {
    // console.log(this.newNote)
    if (!this.data.tag.toString().endsWith(',')) {
      this.data.tag = this.data.tag + ','
    }
    if (this.data.tag.toString().endsWith(',')) {
      this.data.tag = this.data.tag + ''
    }

    this.data.start_date = Helper.convertDate(new Date(this.time[0]))
    this.data.end_date = Helper.convertDate(new Date(this.time[1]))
    if (this.NofiIsNull(this.data.task_name, 'Task Name') == 1 ||
      this.NofiIsNull(this.data.start_date, 'start Date') == 1 ||
      this.NofiIsNull(this.data.end_date, 'End Date') == 1 ||
      this.NofiIsNull(this.data.tag, 'Tag') == 1 ||
      this.NofiIsNull(this.data.status, 'Status') == 1 ||
      this.NofiIsNull(this.data.assignees, 'Assignees') == 1 ||
      this.NofiIsNull(this.data.task_code, 'Task Code') == 1 ||
      this.NofiIsNull(this.item_work.task_id, 'Tasl ID') == 1 ||
      this.checkDate() == 1

    ) {
      return
    } else {

      this._service.TaskList_UpdateItem(
        this.data.task_name,
        this.data.description,
        this.data.start_date,
        this.data.end_date,
        this.data.prioritize,
        this.data.tag,
        this.data.status,
        this.data.testing_status ? this.data.testing_status : '',
        this.data.assignees,
        this.data.team_follow ? this.data.team_follow : '',
        this.data.task_code,
        this.item_work.task_id).subscribe((data: any) => {
          if (data.result == EnumStatus.ok) {
            // add file

            // console.log(this.checkUpdate)
            if (this.updateFile?.length > 0 && this.checkUpdate == 1) {
              const param = {
                item_data: "TaskList",
                item_id: this.data.task_code,
                data: this.updateFile
              };
              this._service
                .TaskList_UploadFile(param)
                .subscribe((up: any) => {
                  this.clear()

                });
            }
            // remove file
            if (this.removeList?.length > 0) {
              const param = {
                item_data: "TaskList-delete",
                item_id: this.data.task_code,
                data: this.removeList
              };
              this._service
                .TaskList_UploadFile(param)
                .subscribe((up: any) => {
                });
            }
            this.item_work.visible = false
            this.closeDetail.emit()

            this.clear()
            this.action = 'clear'
          }
        })


    }
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

  createNote() {

    if (this.note.slice(0, 1).find((e: any) => e.note == this.newNote)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Note no change',
      });
      return
    }
    if (this.NofiIsNull(this.newNote, 'Note') == 1) {

      return
    } else {
      this._service.TaskNote_Create(this.item_work.task_id, this.newNote).subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Create Note Success',

          });
          this.getData(this.item_work)
          this.clear()
        }
      })
    }

  }


  handleCancel() {
    this.clear()
    this.item_work.visible = false
  }


  NofiIsNull(value: any, name: any): any {
    let check = 0;
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



  timeHistory: any
  historyDetailData: any
  isShow: boolean = false

  detailStatusHistory(e: any) {
    if (e) {
      this.historyDetailData = this.data_work.history.find((el: any) => el.created_date == e)
      this.timeHistory = [new Date(this.historyDetailData.start_date), new Date(this.historyDetailData.end_date)]
      this.isShow = true
    }


  }

  // zoom

  zoom() {
    this.zoomVisible = !this.zoomVisible
  }




  isHidden() {
    this.isShow = false
  }
  clear() {
    this.data = {
      task_name: null,
      prioritize: null,
      tag: '',
      description: null,
      status: null,
      testing_status: " ",
      start_date: null,
      end_date: null,
      assignees: 0,
      team_follow: null,
      filename: null,
      task_code: null
    }
    this.events = [
      {
        date: null,
        status: null,
        icon: null,
        task_name: null,
        tag: null
      }
    ]
    this.newNote = null
    this.checkUpdate = 0

  }
}
