import { Component, OnInit } from '@angular/core';
import { MasterserviceService } from 'src/app/masterservice.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private service  : MasterserviceService,public router : Router) { }

  ngOnInit(): void {
  }
  logout()
  {
    this.service.logout();

  }

}
