import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MasterserviceService } from 'src/app/masterservice.service';
import { Customer } from 'src/app/model/model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-customer-form1',
  templateUrl: './customer-form1.component.html',
  styleUrls: ['./customer-form1.component.css']
})
export class CustomerForm1Component implements OnInit {
  constructor(public fb: FormBuilder,
    public service : MasterserviceService,
    public router : Router
  ) { }
  customer_model : Customer = new Customer() ;
  ngOnInit(): void {

    const token = localStorage.getItem('token');
    if (!token)
    {
      this.router.navigateByUrl('login');
    }
    if (token && this.isTokenExpired(token) )
    {
      this.router.navigateByUrl('login');
    }


    this.bind_form();
    this.get_data();

  }
  form! : FormGroup;
  customer_data : any;
  get_data()
  {
    this.customer_data = null;
    this.service.customer_get().subscribe((result)=>{
      this.customer_data = result;
      console.log("printing the data",result);
    },
  (err)=>{
    console.log("there is error in the get apu ",err);
  })
  }
  bind_form()
  {
    this.form = this.fb.group({
      name : [''],
      fathers_name : [''],
      address :[''],
      credit_amount : [''],
      description : [''],
      contact_number : [''], 
    });
  }

  bind_model()
  {
    this.customer_model.customer_name = this.form.controls['name'].value;
    this.customer_model.customer_fathers_name = this.form.controls['fathers_name'].value;
    this.customer_model.customer_address = this.form.controls['address'].value ;
    this.customer_model.credit_amount = this.form.controls['credit_amount'].value ;
    this.customer_model.customerType = 1;
    this.customer_model.customer_contact_number = this.form.controls['contact_number'].value;
    this.customer_model.description = this.form.controls['description'].value;
  }

  OnSubmit(): void {

    if(this.form.valid)
    {
      this. bind_model();
      this.saveData(this.customer_model);

    }
 
  }
  saveData(model:Customer)
  {
    this.service.add_customer(model).subscribe((result)=>{
      console.log("result from post data is ",result);
      this.router.navigateByUrl('customer-data');
    },
    (err) =>{
      console.log("error",err);
    }
  
  )
    
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

  reportColumnName: any[] = [];
        getAdvanceSearchColumn() {
            this.reportColumnName = [];
            this.reportColumnName = [
                {
                    key: "INDEX_COLUMN", // do not touch or change this (INDEX_COLUMN)
                    label: 'S.No', // you can change according to you like:- S.No.
                    visible: true
                },
                
                { key: 'customer_name', label: 'Customer Name' },
                { key: 'customer_name_hindi', label: 'Customer Name Hindi'},
                { key: 'customer_fathers_name', label: 'Fathers Name'},
                
         
             ];
    
        }


        myTableActionMenu = [
          { label: "View Application", labelVisibility: true, iconName: "visibility", iconVisibility: true, actionName: "PREVIEW" },
      ];
  
  
      onTableAction(event: any) {
        console.log('event', event);
        //alert(JSON.stringify(event));
        if (event.actionName.name === 'PREVIEW') {
            // this.viewApplicationOpenDialog(event.rowData.BeneficaryProfileId);
        }
      }

      goBack()
      {
        this.router.navigateByUrl('home');
      }
}