import { Component, OnInit ,ViewChild,AfterViewInit } from '@angular/core';
import { Customer } from 'src/app/model/model';
import { MatTableDataSource } from '@angular/material/table';
import { MasterserviceService } from 'src/app/masterservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Router } from '@angular/router';
import Swal from "sweetalert2";
@Component({
  selector: 'app-customer-data',
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.css']
})
export class CustomerDataComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public service : MasterserviceService,
    public loader : NgxUiLoaderService,
    public route : Router
  ) { }
  pageSize: number = 2;  // Default page size
  pageSizeOptions: number[] = [5, 10, 20]; 

  meeting_request_data: MatTableDataSource<Customer> = new MatTableDataSource<Customer>([]);
  displayedColumns: string[] = ['sn', 'customer_name', 'fathers_name' ,'number',   'amount','detail','delete'];

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

  open_customer_detail(id:number)
  {
    this.route.navigate(['/customer-detail', id]);

  }
  delete(id:number)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        // Action to perform when "Yes" is clicked
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      } else {
        // Action to perform when "No" is clicked
        Swal.fire('Cancelled', 'Your file is safe.', 'info');
      }
    });
  }

}
