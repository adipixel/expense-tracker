import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashSidebarComponent } from './components/dash-sidebar/dash-sidebar.component';
import { DashBodyComponent } from './components/dash-body/dash-body.component';


import { DataService } from  './services/data.service';

import { CustomMaterialModule } from './modules/custom-material/custom-material.module';

const appRoutes: Routes = [
  {path: '', component:LoginComponent},
  {path: 'about', component:AboutComponent},
  {path: 'dashboard', component:DashboardComponent}  
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AboutComponent,
    DashboardComponent,
    NavbarComponent,
    DashSidebarComponent,
    DashBodyComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    CustomMaterialModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
