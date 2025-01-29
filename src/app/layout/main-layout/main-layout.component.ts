import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  constructor(
    public router : Router
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');  // Check if the user has a token
    if (!token) {
      this.router.navigate(['/login']);  // Otherwise, navigate to login
    } 
  }
  


}
