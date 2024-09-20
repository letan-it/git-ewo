import { OrderListModule } from 'primeng/orderlist';
import { Component } from '@angular/core';
import { NodeService } from 'src/app/web/service/node.service';
import { FileService } from 'src/app/web/service/file.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage } from 'src/app/Core/_enum';
import { AppComponent } from 'src/app/app.component';

@Component({
    templateUrl: './emptydemo.component.html',
})
export class EmptyDemoComponent {

    constructor(
        private fileUploadService: FileService,
        private nodeService: NodeService,
        private EDService: EncryptDecryptService
    ) { }
    getCurrentDate(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
      }
      
    uploadFile(event: any) {
        const file = event.target.files[0];  // Get the selected file
        const fileName = AppComponent.generateGuid();
        const newFile = new File([file], fileName+file.name.substring(file.name.lastIndexOf('.')),{type: file.type});
        const modun = 'product-01';
        const drawText = 'test-01';
        this.fileUploadService.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
          (response : any) => {
            console.log('Upload successful:', response);
            console.log ( response.url)
          },
          (error : any) => {
            console.error('Upload error:', error);
          }
        );
    }
    

    pushitem(min_value: number, max_value: number) {
        let new_object = [];
        for (let i = min_value; i <= max_value; i++) {
            new_object.push(i);
        }
        return new_object;
    }
    arrays: number[][] = [];
    button_list: any = [
        {name: 'key1',value:'key1',title:'Thêm vào key1',type:'add'},
        {name: 'key1',value:'key1',title:'Thêm vào key1',type:'remove'},

        
        {name: 'key2',value:'key2',title:'Thêm vào key2'},
        {name: 'key3',value:'key3',title:'Thêm vào key3'},
        {name: 'key4',value:'key4',title:'Thêm vào key4'},
        {name: 'key5',value:'key5',title:'Thêm vào key5'},
        {name: 'key6',value:'key6',title:'Thêm vào key6'},
    ]
    test: any = [] 
    Push(item: any) {
        if (!this.test.includes(item.value)) {
            this.test.push(item.value);
        }
        console.log(this.test);
        
    }

    remove(item: String) {
        const index = this.test.indexOf(item);
        if (index !== -1) {
            this.test.splice(index, 1);
        }
        console.log(this.test);

    }

    CheckExists(item: string) {
        const index = this.test.indexOf(item);
        if (index !== -1) { 
            return 1

        }
        else {
            return 0
        }
        
    }
    formatAmount(amount: number): string {
        if (amount >= 1000000000) {
          return (amount / 1000000000).toFixed(2).replace('.', ',') + 'B';
        } else if (amount >= 1000000) {
          return (amount / 1000000).toFixed(2).replace('.', ',') + 'M';
        } else {
          return amount.toString();
        }
    }
   
    getWeekRange(date: Date): { fromDate: string; toDate: string } {
        const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
        
        // Calculate the start of the week (Monday)
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
      
        // Calculate the end of the week (Sunday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
      
        // Format dates as 'YYYYMMDD'
        const fromDate = this.formatDate(startOfWeek);
        const toDate = this.formatDate(endOfWeek);
      
        return { fromDate, toDate };
      }
      
      formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
      }
      project:any

    ngOnInit(): void {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.EDService.decryptUsingAES256(_u)
        ).projects.filter(
            (d: any) => d.project_id == Helper.ProjectID()
        )[0];
        

        console.log(this.project);
        
       


        const now = new Date('2024-08-20');
const { fromDate, toDate } = this.getWeekRange(now);
console.log(`From Date: ${fromDate}, To Date: ${toDate}`);
        // console.log("pushNoti");
        this.nodeService.PushNoti("dh9pGWpyJ0Onms-8f2-5j1:APA91bF93KZ72MrvwPUxAV9huRKa6UE19FsuP6luaBSEbEuKCCr2HgFhZczqrNWyT9ZEGDCnd_xTLoz2nePXz_xPTz62dbf065QH_5RMMeA5G19OWCoO3P4n_Y5OCLStOuTtg8iWBUww", "explanation_plan", "", "title", "description", "content", "web", 12).subscribe(data => { 

            console.log(data);
            
        })

        let data = [
            { question_id: 523, order: 1 },
            { question_id: 524, order: 2 },
            { question_id: 525, order: 3 },
            { question_id: 526, order: 4 },
            { question_id: 527, order: 5 },
            { question_id: 528, order: 6 },
            { question_id: 529, order: 7 },
            { question_id: 530, order: 8 },
            { question_id: 531, order: 9 },
            { question_id: 532, order: 10 },
            { question_id: 534, order: 11 },
            { question_id: 535, order: 12 },
            { question_id: 536, order: 13 },
        ];

        let data_question = [
            {
                question_id: 523,
                order_question: 1,
                next_question: 525,
                order_next_question: 3,
                rule: [],
            },
            {
                question_id: 523,
                order_question: 1,
                next_question: 526,
                order_next_question: 4,
                rule: [],
            },
            {
                question_id: 524,
                order_question: 2,
                next_question: 531,
                order_next_question: 9,
                rule: [],
            },
            {
                question_id: 525,
                order_question: 3,
                next_question: 528,
                order_next_question: 6,
                rule: [],
            },
            {
                question_id: 535,
                order_question: 11,
                next_question: 536,
                order_next_question: 13,
                rule: [],
            },
        ];

        let maxOrder = -1;

        for (let item of data) {
            if (item.order > maxOrder) {
                maxOrder = item.order;
            }
        }
        data_question.forEach((dq: any) => {
            data.forEach((d: any) => {
                if (
                    dq.order_question + 1 <= d.order &&
                    d.order <= dq.order_next_question
                ) {
                    dq.rule.push(1);
                } else {
                    dq.rule.push(0);
                }
            });
        });
        const rule: any = [];
        data_question.forEach((element) => {
            rule.push(element.rule);
        });
        const numColumns = rule[0].length;

        // Initialize the result array with zeros
        const _Array = new Array(numColumns).fill(0);

        // Iterate through the columns and find the maximum value for each column
        for (let col = 0; col < numColumns; col++) {
            for (let row = 0; row < rule.length; row++) {
                _Array[col] = Math.max(_Array[col], rule[row][col]);
            }
        }
        const resultArray: any = [];
        for (let index = 0; index < _Array.length; index++) {
            const element = _Array[index];
            resultArray.push({
                order: index + 1,
                rule: element,
            });
        }

        const order_rule: any = [];
        for (let index = 0; index < resultArray.length; index++) {
            const element = resultArray;
            order_rule.push({
                order: index + 1,
                rule: element,
            });
        }

        for (let index = 0; index < order_rule.length; index++) {
            order_rule[index].question_id = data.filter(
                (i) => i.order == order_rule[index].order
            )[0].question_id;

            let temp = order_rule[index].rule.filter(
                (item: any) => item.order > order_rule[index].order
            );
            temp.forEach((ii: any) => {
                ii.question_id = data.filter(
                    (i) => i.order == ii.order
                )[0].question_id;
            });
            try {
                let key_order = temp.filter((obj: any) => obj.rule === 0)[0]
                    .order;
                temp = temp.filter((item: any) => item.order < key_order);
            } catch (error) {}

            order_rule[index].sub_rule = temp;
            delete order_rule[index]['rule'];
        }
        console.log('order_rule', order_rule);



        this.loadProduct()
    }

    ////////////////////////////////////////////////////////////
    item_QuestionMaster: number = 0;
    selectQuestionMaster(event: any) {
        this.item_QuestionMaster = event != null ? event.code : 0;
    }

    urlgallery: any;
    openImage() {
        const listphoto = [
            {
                id: 53,
                work_id: 42,
                src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Test-Logo.svg/783px-Test-Logo.svg.png',
                title: 'In-Overview',
                image_time: '2023-03-23 16:24:10',
                _index: 1,
            },
        ];
        const changeindex = 1;
        localStorage.setItem('listphoto', JSON.stringify(listphoto));
        localStorage.setItem('changeindex', JSON.stringify(changeindex));

        this.urlgallery = 'assets/ZoomImage/tool.html';
        document.open(
            <string>this.urlgallery,
            'image_default',
            'height=700,width=900,top=100,left= 539.647'
        );
    }

    products!: any[];
    ingredient: string = 'Cate';
    changeGroup(item:any) {
        this.ingredient = item
        if (item == 'Cate') {
            this.products = [
                {
                   
                  "product_name": "SKU1",
                  "category": "CATE2",
                      representative: {
                      name:'CATE2'
                    },
                    "label": "face",
                  "value": 24
                  
                },
                {
                   
                    "product_name": "SKU1",
                    "category": "CATE2",
                        representative: {
                        name:'CATE2'
                    },
                    "label": "quantity",
                        
                    "value": 24
                    
                },
                {
                   
                    "product_name": "SKU2",
                    "category": "CATE1",
                        representative: {
                        name:'CATE1'
                    },
                    "label": "face",
    
                    "value": 2
                    
                  },
                  {
                     
                      "product_name": "SKU2",
                      "category": "CATE1",
                          representative: {
                          name:'CATE1'
                      },
                    "label": "quantity",
                          
                      "value": 24
                      
                },
                {
                   
                    "product_name": "SKU3",
                    "category": "CATE2",
                        representative: {
                        name:'CATE2'
                    },
                    "label": "face",
                        
                    "value": 2
                    
                  },
                  {
                     
                      "product_name": "SKU3",
                      "category": "CATE2",
                          representative: {
                          name:'CATE2'
                      },
                    "label": "quantity",
                          
                      "value": 24
                      
                    },
              ] 
        }
        else {
        
            this.products = [
                {
                   
                  "product_name": "SKU1",
                  "category": "CATE2",
                      representative: {
                      name:'SKU1'
                    },
                    "label": "face",
                  "value": 24
                  
                },
                {
                   
                    "product_name": "SKU1",
                    "category": "CATE2",
                        representative: {
                        name:'SKU1'
                    },
                    "label": "quantity",
                        
                    "value": 24
                    
                },
                {
                   
                    "product_name": "SKU2",
                    "category": "CATE1",
                        representative: {
                        name:'SKU2'
                    },
                    "label": "face",
    
                    "value": 2
                    
                  },
                  {
                     
                      "product_name": "SKU2",
                      "category": "CATE1",
                          representative: {
                          name:'SKU2'
                      },
                    "label": "quantity",
                          
                      "value": 24
                      
                },
                {
                   
                    "product_name": "SKU3",
                    "category": "CATE2",
                        representative: {
                        name:'SKU3'
                    },
                    "label": "face",
                        
                    "value": 2
                    
                  },
                  {
                     
                      "product_name": "SKU3",
                      "category": "CATE2",
                          representative: {
                          name:'SKU3'
                      },
                    "label": "quantity",
                          
                      "value": 24
                      
                    },
              ]

             
           
        }
       
        console.log( this.products);
        
    }
    loadProduct() {
     
        this.products = [
            {
               
              "product_name": "SKU1",
              "category": "CATE2",
                  representative: {
                  name:'CATE2'
                },
                "label": "face",
              "value": 24
              
            },
            {
               
                "product_name": "SKU1",
                "category": "CATE2",
                    representative: {
                    name:'CATE2'
                },
                "label": "quantity",
                    
                "value": 24
                
            },
            {
               
                "product_name": "SKU2",
                "category": "CATE1",
                    representative: {
                    name:'CATE1'
                },
                "label": "face",

                "value": 2
                
              },
              {
                 
                  "product_name": "SKU2",
                  "category": "CATE1",
                      representative: {
                      name:'CATE1'
                  },
                "label": "quantity",
                      
                  "value": 24
                  
            },
            {
               
                "product_name": "SKU3",
                "category": "CATE2",
                    representative: {
                    name:'CATE2'
                },
                "label": "face",
                    
                "value": 2
                
              },
              {
                 
                  "product_name": "SKU3",
                  "category": "CATE2",
                      representative: {
                      name:'CATE2'
                  },
                "label": "quantity",
                      
                  "value": 24
                  
                },
          ]
    }
 
}
