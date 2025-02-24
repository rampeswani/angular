import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MasterserviceService } from 'src/app/masterservice.service';
import { TestData } from '../../../model/model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent implements OnInit {

  constructor(public fb : FormBuilder,
    public service : MasterserviceService,
    public router : Router,
    public http : HttpClient,
    
  ) { }
  form! : FormGroup ; 
  model : TestData = new TestData() 
  ngOnInit(): void {
    // const token = localStorage.getItem('token');
    // if (!token)
    // {
    //   this.router.navigateByUrl('login');
    // }
    // if (token && this.isTokenExpired(token) )
    // {
    //   this.router.navigateByUrl('login');
    // }
    this.bindForm();
    this.loadCaptcha();
  }
  private isTokenExpired(token: string): boolean {
    try {
      const jwtPayload = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
      const exp = jwtPayload.exp; // Expiry timestamp in seconds
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return exp < currentTime; // Returns true if the token is expired
    } catch (e) {
      console.error('Error decoding token:', e);
      return true; // Treat the token as expired if decoding fails
    }
  }
  bindForm()
  {
    this.form = this.fb.group({
      test_data_name  : ['',Validators.required],
      test_data_email : ['',Validators.required],
      test_data_description : ['',Validators.required],
      test_data_remark : ['',Validators.required]
    })
  }
  bindModel()
  {
    this.model.test_data_name = this.form.value.test_data_name ;
    this.model.test_data_description = this.form.value.test_data_description;
    this.model.test_data_email = this.form.value.test_data_email ; 
    this.model.test_data_remark = this.form.value.test_data_remark;
    this.model.id = 2
  }
  onSubmit()
  {
    if(this.form.valid)
    {
      this.bindModel();
      this.saveData(this.model);
    }
  }
  saveData(model : TestData)
  {
    // this.service.add_customer(
    //   'John Doe',               // customer_name
    //   'Father Name',            // customer_fathers_name
    //   '123 Main St',            // customer_address
    //   '1234567890',             // customer_contact_number
    //   1000.00,                  // credit_amount
    //   1,                        // customer_type_id (foreign key reference)
    //   'Customer Description'    // description
    // ).subscribe((result)=>{

    
    this.service.addTestData("ram P").subscribe((result)=>{
      console.log("printing the data of hitting api ",result);
    }
    ,(err)=>{
      console.log("error in posting api",err);
    }
  
  )
  }

  captchaUrl: string = '';
  loadCaptcha(): void {
    this.http.get('http://127.0.0.1:8000/api/captcha/').subscribe((response: any) => {
      this.captchaUrl = response.captcha_url;  // This is the URL of the captcha image
    });
  }

}
