import { Component, SimpleChanges, Input } from '@angular/core';
import { Helper } from 'src/app/Core/_helper';
import { ReportsService } from 'src/app/web/service/reports.service';


@Component({
  selector: 'app-shop-info',
  templateUrl: './shop-info.component.html',
  styleUrls: ['./shop-info.component.scss']
})
export class ShopInfoComponent {

  products!: any;
  responsiveOptions: any;

  @Input() inValue: any;

  constructor(
    private _service: ReportsService
  ) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['inValue']) {

      console.log("🚀 ~ file: shop-info.component.ts:26 ~ ShopInfoComponent ~ ngOnChanges ~ this.inValue:", this.inValue)
    }
  }

  visible: boolean = false;
  showDialog(result: any) {
    this.visible = (result == 0 ? true : false);
  }

  edit(item: any) {

  }
  getSeverity(result: any): any {
    switch (result) {
      case 0:
        return 'danger';
      case 1:
        return 'success';

    }
  }

  urlgallery: any;
  openImage(item: any) {

    // this.urlgallery = 'assets/ZoomImage/tool.html';
    this.urlgallery = item;
    document.open(
      <string>this.urlgallery,
      'windowName',
      'height=700,width=900,top=100,left= 539.647'
    );
  }

  mapPopup(lat: any, long: any) {
    this.urlgallery =
      'https://www.google.com/maps/search/' + lat + '+' + long;
    document.open(
      <string>this.urlgallery,
      'windowName',
      'height=700,width=900,top=100,left= 539.647'
    );
  }

  openImageDbClick(image: any, listphoto: any) {
    console.log("🚀 ~ file: shop-info.component.ts:69 ~ ShopInfoComponent ~ openImageDbClick ~ image:", image)

    const changeindex = image._index;
    localStorage.setItem('listphoto', JSON.stringify(listphoto));
    localStorage.setItem('changeindex', JSON.stringify(changeindex));

    this.urlgallery = 'assets/ZoomImage/tool.html';
    document.open(
      <string>this.urlgallery,
      'windowName',
      'height=700,width=900,top=100,left= 539.647'
    );

  }

  checkNull(value: any): any {
    return (Helper.IsNull(value) == true) ? true : false
  }


}
