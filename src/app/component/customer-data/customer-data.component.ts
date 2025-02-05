import { Component, OnInit ,ViewChild,AfterViewInit } from '@angular/core';
import { Customer } from 'src/app/model/model';
import { MatTableDataSource } from '@angular/material/table';
import { MasterserviceService } from 'src/app/masterservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: 'app-customer-data',
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.css']
})
export class CustomerDataComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public service : MasterserviceService,
    public loader : NgxUiLoaderService
  ) { }
  pageSize: number = 2;  // Default page size
  pageSizeOptions: number[] = [5, 10, 20]; 

  meeting_request_data: MatTableDataSource<Customer> = new MatTableDataSource<Customer>([]);
  displayedColumns: string[] = ['sn', 'customer_name', 'fathers_name' ,'number',   'amount',];

  ngOnInit(): void {
    this.loader.start();
    this.get_data();

  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.meeting_request_data.paginator = this.paginator;
    } else {
      console.error('Paginator not initialized!');
    }
}
updatePageSize() {
  if (this.paginator) {
    this.paginator.pageSize = this.pageSize;
    this.paginator._changePageSize(this.pageSize);  // Manually trigger the page size change
  }
}

  get_data()
  {
    this.service.customer_get().subscribe((result)=>{
      
      
      console.log("data from customer get is ",result);
      this.meeting_request_data.data = result
      this.meeting_request_data.paginator = this.paginator;  // Assign paginator here
      console.log("this is meeeting data", this.meeting_request_data);
      this.loader.stop();
    },
    (err)=>{
      console.log("error in fetching data from the API of customer get ");
    }
  )
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.meeting_request_data.filter = filterValue.trim().toLowerCase();

    if (this.meeting_request_data.paginator) {
      this.meeting_request_data.paginator.firstPage();
    }
  }

}
