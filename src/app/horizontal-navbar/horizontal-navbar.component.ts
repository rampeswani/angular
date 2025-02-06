import { Component, OnInit } from '@angular/core';
import { MasterserviceService } from '../masterservice.service';

@Component({
  selector: 'app-horizontal-navbar',
  templateUrl: './horizontal-navbar.component.html',
  styleUrls: ['./horizontal-navbar.component.css']
})
export class HorizontalNavbarComponent implements OnInit {

  constructor(private service : MasterserviceService) 
  { }

  ngOnInit(): void {
  }
  logout()
  {
    this.service.logout();
    
  }
}
