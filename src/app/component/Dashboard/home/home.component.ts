import { Component, OnInit } from '@angular/core';
import { MasterserviceService } from 'src/app/masterservice.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public service : MasterserviceService,
    public router : Router
  ) { }

  ngOnInit(): void {
    this.get_customer_type();
  }
  data: any ;
  get_customer_type()
  {
    this.service.customer_type_get().subscribe((result)=>{
      console.log("data of customer type from api ",result);
      this.data = result;

    },
    (err)=>{
      console.log("there is error",err);
    }
  )

  }
  change(event: any)
  {
    console.log("event value of radio button",event.value);
    if(event.value === 1)
    {
      this.router.navigateByUrl('customer-1');
    }
  }

}
