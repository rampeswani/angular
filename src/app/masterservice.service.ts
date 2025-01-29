import { Injectable } from '@angular/core';
import { HttpParams,HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestData ,Customer} from './model/model';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class MasterserviceService {

  constructor( private http: HttpClient, private router : Router) { }
  apiurl="http://127.0.0.1:8000/api/" ; 
  // apiurl="https://inventory-python.vercel.app/api/" ; 
  // login_api(user_name: string, password: string): Observable<any> {
  //   // Using HttpParams to build query parameters
  //   const params = new HttpParams()
  //     .set('user_name', user_name)
  //     .set('password', password);

  //   // Sending parameters in the request body (as per REST standards for POST)
  //   return this.http.post<{ access_token: string; user_name: string; password: string; user_id: any; expiry_time: any }>(
  //     this.apiurl + 'login-2/',
  //     {
        
  //     }, // Empty body since the data is passed via params
  //     { params } // Pass HttpParams as options
  //   );
  // }

  login(username: string, password: string,captcha: string): Observable<any> {
    return this.http.post(this.apiurl +'api/', { username, password,captcha });
  }
  post_test_data(model: TestData) {
    const headers = new HttpHeaders({
      'content-type': 'application/json',
    });
    console.log('Headers being sent:', headers.keys());
    return this.http.post(this.apiurl  + "create-test-data/", model, { headers });
  }

  addTestData(data: string): Observable<any> {
    const token = localStorage.getItem('token');
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(
      this.apiurl + "test/",
      { data },
      // { headers }
    );
  }
  // add_customer(customer_name: string,
  //   customer_fathers_name: string,
  //   customer_address: string,
  //   customer_contact_number: string,
  //   credit_amount: number,
  //   customer_type_id: number,  // customerType is a foreign key to CustomerType
  //   description: string, ): Observable<any>{
  //     const data = {
  //       customer_name,
  //       customer_fathers_name,
  //       customer_address,
  //       customer_contact_number,
  //       credit_amount,
  //       customerType: { customer_type_id },  // Sending the related customerType object
  //       description,
       
  //     };
  //   return this.http.post(
  //     this.apiurl+"customer/",
  //     {data}  
  //   );
  // }
  add_customer(model: Customer): Observable<any> {
    const data = {
      customer_name: model.customer_name,
      customer_fathers_name: model.customer_fathers_name,
      customer_address: model.customer_address,
      customer_contact_number: model.customer_contact_number,
      credit_amount: model.credit_amount,
      customerType: model.customerType,  // Sending the related customerType object
      description: model.description,
    };
  
    return this.http.post(
      `${this.apiurl}customer/`,
      { data }
    );
  }
  
  logout()
  {
    this.router.navigateByUrl('login');
    localStorage.removeItem('token');
  }
  loadCaptcha(): Observable<Blob> {
    return this.http.get(this.apiurl + 'captcha/', { responseType: 'blob' });
  }

  customer_type_get(): Observable<any>
  {
    return this.http.get(this.apiurl + "customer-get/");
  }

  customer_get():Observable<any>
  {
    return this.http.get(this.apiurl + "customer-get-get");
  }
  

}
