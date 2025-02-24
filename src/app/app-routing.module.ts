import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { TestFormComponent } from './component/testform/test-form/test-form.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { HomeComponent } from './component/Dashboard/home/home.component';
import { CustomerForm1Component } from './component/customer-form1/customer-form1.component';
import { CustomerDataComponent } from './component/customer-data/customer-data.component';
import { CustomerDetailComponent } from './component/customer-detail/customer-detail.component';
import { AuthGuard } from './auth.guard';
import { AComponent } from './component/a/a.component';
const routes: Routes = [

  { path: '',
    redirectTo: '/login',  // Redirect to 'login' when the path is empty
    pathMatch: 'full'      // Ensure that it matches the full path
  },
  
  { path:'',
    component : MainLayoutComponent, canActivate:[AuthGuard],
    children:
    [
    {  path:"home",component:HomeComponent, },
    
    {   path:'test-form', component : TestFormComponent},
    {path: 'customer-1', component : CustomerForm1Component},
    {path: 'customer-data', component : CustomerDataComponent},
    {path:'customer-detail/:id',component : CustomerDetailComponent},
    
    ]

  },
  {
    path: 'login',
    component : AuthLayoutComponent,
    children:[
      {path:'',component :LoginComponent}
    ]
  }
  ,
  {path:'a',component:AComponent,canActivate :[AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// {path: "",
//   component : MainLayoutComponent,
//   children : [
//     {path :"home",component : HomeComponent},
//     {path:"test-form",component : TestComponentComponent}
//   ]
//   },
//   {
//     path:'login-page',
//     component : AuthLayoutComponent,
//     children : [
//       {path:'',component: LoignComponentComponent}
//     ]
//   }