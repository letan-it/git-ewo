import { Component } from '@angular/core';
import { APIConfigService } from '../service/api-config.service';
import { EnumStatus } from 'src/app/Core/_enum';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-api-config',
  templateUrl: './api-config.component.html',
  styleUrls: ['./api-config.component.scss'],
  providers: [MessageService]
})
export class ApiConfigComponent {
 

  constructor(private api_service: APIConfigService,private messageService: MessageService,) {}
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
  paramType: any = [
  { name: 'queryString', code: 'queryString' },
  { name: 'header', code: 'header' },
  ]
  selectparamType:any ={ name: 'queryString', code: 'queryString' }
  ngOnInit() {
    this.loadApiList()
  }
  copyText( content: any) {
    let val = content;
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.messageService.add({
        severity: 'success',
        summary: 'copy text successfully',
        detail: val,
    });
}

  new_api: any = 0
  item_new: any = {
    url: "",
    desc:"",
    cache_minutes: null,
    key_request: null,
    value_desc: null,
    param: []
  }
  addParam() {
    if (this.item_new.key_request == null || this.item_new.key_request == undefined || this.item_new.key_request == "" || this.item_new.value_desc == null || this.item_new.value_desc == undefined || this.item_new.value_desc == "") {
      alert("Please fill out the key and sample information")
      return
    }
    else {
      this.item_new.param.push({
        api_id: 0,
        key_request: this.item_new.key_request, 
        value_desc: this.item_new.value_desc,
        type: this.selectparamType.code
      })
      this.item_new.key_request = null
      this.item_new.value_desc = null
      console.log(this.item_new);
      
    }
  }
  removeKeyParam(id: any) {
    this.item_new.param =   this.item_new.param.filter((p:any) => p.key_request != id)
  }
  newAPI() {
    if (this.new_api == 0) {
      this.new_api = 1
    }
    else {
      this.new_api = 0
      this.item_new  = {
        url: "",
        desc:"",
        cache_minutes: null,
        key_request: null,
        value_desc: null,
        param: []
      }
    }
  }
  
  deleteAPI(item: any) {
    console.log(item);
    this.api_service.API_Create(item.url, 'desc', -9999, [{api_id:0,key_request:"key_request",value_desc:"value_desc",type:"type"}]).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) { 
        alert("Success");
        this.loadApiList()
      }
    })
  }
  onCreateAPI() {
    if (this.item_new.url == "" || this.item_new.url == null || this.item_new.url == undefined) {
      alert("Please fill out the key and sample information")
      return
    }
    else {
      this.api_service.API_Create(this.item_new.url, this.item_new.desc, this.item_new.cache_minutes, this.item_new.param).subscribe((data: any) => {
        if (data.result == EnumStatus.ok) { 
          alert("Success");
          this.newAPI()
          this.loadApiList()
        }
      })
     }
  }
  API_List: any
 warehouse_Url = "https://warehouse-api.acacy.vn/api"
  loadApiList() {
    this.api_service.API_GetList().subscribe((data:any) => {
      if (data.result == EnumStatus.ok) {
        this.API_List = undefined;
        this.API_List = data.data.api_list
        this.API_List.forEach((element: any) => {
          const param = data.data.param.filter((i: any) => i.api_id == element.api_id && i.type =="queryString")
          const header = data.data.param.filter((i: any) => i.api_id == element.api_id && i.type =="header")
          const token_list = data.data.token_list.filter((i: any) => i.api_id == element.api_id)
          const token_list_header = data.data.token_list_header.filter((i: any) => i.api_id == element.api_id)
          let url_preview = element.url
          param.forEach((p:any,index:any) => {
            if (index == 0) {
              url_preview=url_preview+"?"+p.key_request+"="+p.value_desc
            }
            else {
              url_preview=url_preview+"&"+p.key_request+"="+p.value_desc
            }

          });
          element.url_preview = url_preview
          element.param = param
          element.header = header
          element.param_new = param.map((p: any, index: any) => ({ 
            "key_request": p.key_request,
            "value_desc": undefined,
            "type":"queryString",
          }))
          element.param_new_header = header.map((p: any, index: any) => ({ 
            "api_id":0,
            "key_request": p.key_request,
            "value_desc": undefined,
            "type":"header",
          }))
         
          token_list.forEach((i:any) => {
            i.header = token_list_header.filter((h: any) => h.uuid == i.uuid)
            i.url_public =this.warehouse_Url+"/Publish/Get?uuid="+i.uuid
            i.content = i.url_preview+" ➡️ "+ this.warehouse_Url+"/Publish/Get?uuid="+i.uuid 
          });
          element.token_list = token_list

          element.newkey = 0
          element.newkey_request = undefined
          element.newkey_desc = undefined

          element.createtoken = 0
        });
        console.log(this.API_List);
      }
     })
  }
  
  changeURLPreview(item:any) {
    console.log(item);
    let url_preview = item.url
    item.param.forEach((p:any,index:any) => {
      if (index == 0) {
        url_preview=url_preview+"?"+p.key_request+"="+p.value_desc
      }
      else {
        url_preview=url_preview+"&"+p.key_request+"="+p.value_desc
      }

    });
    item.url_preview = url_preview
  }
  newKey(item: any) {
    if( item.newkey == 0)
      item.newkey = 1
    else {
      item.newkey = 0
      item.newkey_request = undefined
      item.newkey_desc = undefined
    }
  }
  createtoken(item: any) {
    if( item.createtoken == 0)
    item.createtoken = 1
    else {
      item.createtoken = 0
      console.log(item);
      item.param_new =  item.param_new.map((p: any, index: any) => ({ 
        "key_request": p.key_request,
        "value_desc": undefined
      }))
      
    }
  }
  changeStatusToken(token: any,status:any,token_list:any) {
    console.log(token);
      
    this.api_service.API_CreateToken(0, token.api_id, token.uuid, token.url_preview, status, [{api_id:-1,key_request:'null',value_desc:'null',type:'null'}]).subscribe((data: any) => {
      if (status == -1) {
         this.loadApiList()
      }
      if (data.result == EnumStatus.ok) {
        alert("Success");
        token.status = status
       
      }
    })
    
  }
  OnCreateToken(item:any) {
    console.log("🚀 ~ file: api-config.component.ts:117 ~ ApiConfigComponent ~ OnCreateToken ~ item:", item)
    item.param_new.forEach((element:any) => {
      if (element.value_desc == "" || element.value_desc == undefined || element.value_desc == null) {
        alert("Please fill out the key and sample information")
        return
      }
    });
    let url_preview= item.url
    item.param_new.forEach((p:any,index:any) => {
      if (index == 0) {
        url_preview=url_preview+"?"+p.key_request+"="+p.value_desc
      }
      else {
        url_preview=url_preview+"&"+p.key_request+"="+p.value_desc
      }

    });

  
    this.api_service.API_CreateToken(0, item.api_id, null, url_preview, 1,item.param_new_header).subscribe((data:any) => {
      if (data.result == EnumStatus.ok) {
        alert("Success");
        this.createtoken(item)
        this.loadApiList()
        item.token_list.push(
          {
            "id": data.data.id,
            "api_id": data.data.api_id,
            "uuid": data.data.uuid,
            "year_month": 0,
            "url_preview": url_preview,
            "status": 1,
            "created_by": null,
            "created_date": "now",
            "update_by": null,
            "update_time": null,
            "count_connect": '#'
        }
        )
      }
    })
       
     
  }
  savekey(item:any) {
    console.log("🚀 ~ file: api-config.component.ts:70 ~ ApiConfigComponent ~ savekey ~ item:", item)
    if (item.newkey_request == '' || item.newkey_request == undefined || item.newkey_request == null ||
    item.newkey_desc == '' || item.newkey_desc == undefined || item.newkey_desc == null) {
      alert("Please fill out the key and sample information")
      return
    }
    else {
      if (this.selectparamType.code == "header") {
        item.header.push({
          api_id: 0,
          id: 0,
          key_request: item.newkey_request,
          value_desc:item.newkey_desc,
          type:this.selectparamType.code
        })
      }
      else {
        item.param.push({
          api_id: 0,
          id: 0,
          key_request: item.newkey_request,
          value_desc:item.newkey_desc,
          type:this.selectparamType.code
        })
      }

      item.newkey = 0
      item.newkey_request = undefined
      item.newkey_desc = undefined

     
      this.changeURLPreview(item)
    }
  }    
  removeKey(item: any, key: any) {
    item.param = item.param.filter((i:any)=>i.key_request!= key)
    console.log(item);
    console.log(key);
    
  }
  testAPI(url:any) {
    document.open(
        <string>url,
        'image_default',
        'height=700,width=900,top=100,left= 539.647'
    );
  }
  viewAPI(token: any) {
    const url = this.warehouse_Url+"/Publish/Get?uuid=" +token
    document.open(
        <string>url,
        'image_default',
        'height=700,width=900,top=100,left= 539.647'
    );
  }
  onUpdate(item: any) {
    console.log(item);

    const data = {
      url: item.url,
      desc: item.desc,
      cache_minutes:  item.cache_minutes ==0?30:parseInt(item.cache_minutes),
      param: item.param.map((obj:any) => ({  
        "api_id": 0,
        "key_request": obj.key_request,
        "value_desc": obj.value_desc,
        "type":obj.type
      }))
    }
    item.header.forEach((obj:any) => {
      data.param.push({
        "api_id": 0,
        "key_request": obj.key_request,
        "value_desc": obj.value_desc,
        "type":obj.type
      })
    });
   
    this.api_service.API_Create(data.url, data.desc, data.cache_minutes, data.param).subscribe((data:any) => {
      if (data.result == EnumStatus.ok) {
        alert("Success");
      }
    })
    console.log("🚀 ~ file: api-config.component.ts:116 ~ ApiConfigComponent ~ onUpdate ~ data:", data)
  }

}
