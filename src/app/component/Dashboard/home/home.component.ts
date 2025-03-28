import { Component, OnInit } from '@angular/core';
import { MasterserviceService } from 'src/app/masterservice.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public service : MasterserviceService,
    public router : Router,
    public loader : NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.loader.start()
    this.get_customer_type();
  }
  data: any ;
  get_customer_type()
  {
    this.service.customer_type_get().subscribe((result)=>{
      console.log("data of customer type from api ",result);
      this.data = result;
      this.loader.stop();
    },
    (err)=>{
      console.log("there is error",err);
    }
  )

  }
  change(event: number)
  {
    console.log("event value of radio button",event);
    if(event === 1)
    {
      this.router.navigateByUrl('customer-1');
    }
  }
  goBack()
  {
    
  }

}
