import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    NgModule,
} from '@angular/core';
import {
    CommonModule,
    HashLocationStrategy,
    LocationStrategy,
    PathLocationStrategy,
} from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './web/components/notfound/notfound.component';
import { ProductService } from './web/service/product.service';
import { CountryService } from './web/service/country.service';
import { CustomerService } from './web/service/customer.service';
import { EventService } from './web/service/event.service';
import { IconService } from './web/service/icon.service';
import { NodeService } from './web/service/node.service';
import { PhotoService } from './web/service/photo.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './Core/error.interceptor';
import { JwtInterceptor } from './Core/jwt.interceptor';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NgxImageCompressService } from 'ngx-image-compress'; 
import { StatusCodeInterceptor } from './Core/status-code.interceptor';
import { DockModule } from 'primeng/dock';
import { DialogModule } from 'primeng/dialog';
// import { PageDocsComponent } from './web/components/pages/page-docs/page-docs.component'; 

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        LoadingBarModule,
        LoadingBarHttpClientModule,
        ToastModule,
        CommonModule,
        DockModule,
        DialogModule,
        
    ],

    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        ProductService,
        MessageService,
        NgxImageCompressService,

        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: StatusCodeInterceptor,
            multi: true,
        },
        { provide: LocationStrategy, useClass: PathLocationStrategy },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
