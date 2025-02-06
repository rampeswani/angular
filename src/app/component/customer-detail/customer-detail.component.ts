import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { MasterserviceService } from 'src/app/masterservice.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {

  constructor(public loader : NgxUiLoaderService,
    public service : MasterserviceService,
    public act_route : ActivatedRoute

  ) 
   { }
  id : number ;
  ngOnInit(): void {
    this.id = Number(this.act_route.snapshot.paramMap.get('id'));
    this.loader.start();
    this.get_detail();
    this.loader.stop();
    
  }
  get_detail()
  {
    this.service.customer_detail(this.id).subscribe((result)=>{
      console.log("succes in getting data",result);
    },
    (err)=>{
      console.log("error in getting the data",err);
    }
  )
  }

}
