import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { AuthInterceptor } from './auth.interceptor';
import { MasterserviceService } from './masterservice.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TestFormComponent } from './component/testform/test-form/test-form.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { NavbarComponent } from './NAVBAR/navbar/navbar.component';
import { HomeComponent } from './component/Dashboard/home/home.component';


import { CustomerForm1Component } from './component/customer-form1/customer-form1.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';



import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CustomerDataComponent } from './component/customer-data/customer-data.component';
import { HorizontalNavbarComponent } from './horizontal-navbar/horizontal-navbar.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { CustomerDetailComponent } from './component/customer-detail/customer-detail.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TestFormComponent,
    AuthLayoutComponent,
    LoginLayoutComponent,
    MainLayoutComponent,
    NavbarComponent,
    HomeComponent,
    CustomerForm1Component,
    
    
    CustomerDataComponent,
    HorizontalNavbarComponent,
    CustomerDetailComponent,
    
  ],
  imports: [
    MatMenuModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
     NgxUiLoaderModule ,
    
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,MatFormFieldModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule
    
    
    
  ],
  providers: [MasterserviceService,{provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true}],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
