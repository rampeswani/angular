import { Component, OnInit } from '@angular/core';


import { FormBuilder,FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterserviceService } from 'src/app/masterservice.service';
// import { ReCaptchaV3Service } from 'ngx-captcha';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public service: MasterserviceService, public fb: FormBuilder,
    public loader : NgxUiLoaderService,
    public router : Router,
    // private re_captcha : ReCaptchaV3Service,
    public http: HttpClient,
    public dom : DomSanitizer
    // private captchaService:NgxCaptchaService
    
  ) { 
    
  }
  form! : FormGroup ;
  
  ngOnInit(): void {
    debugger
    this.loader.start();
    
    console.log("inside from the login component");
    
      localStorage.clear();
    this.bindForm();
      this.loadCaptcha();
      this.loader.stop()

  }

  bindForm()
  {
    this.form = this.fb.group({
      user_name : [''],
      password : [''],
      captcha : ['']
    })
  }
  save()
  {
    if(this.form.valid)
    {
      console.log("inside the form");
      const username_ = this.form.value.user_name  ;
      const password = this.form.value.password ;
      
      console.log("user name from form ",username_);
      console.log("password from the form = ",password);

      // const token = 
      // localStorage.setItem("username_",username_);
      // localStorage.setItem("password",password);
      this.service.login(this.form.value.user_name,this.form.value.password,this.form.value.captcha).subscribe((result)=>{
        console.log("print the result",result);
        if(result.access)
        {
          console.log("inside the result.token ");
          localStorage.setItem("token",result.access);
        console.log("token after it get set",localStorage.getItem('access_token'));
        // localStorage.setItem("username_",result.user_name);
        // localStorage.setItem("user_id", result.user_id);
        // localStorage.setItem("password",result.password);
        //  localStorage.setItem("expiry_time",result.expiry_time);
        
        this.router.navigate(['/home']);
        }
        else{
          this.router.navigate(['/home']);
        }
        
        
      },
      (err)=>{
        console.log("error",err);
      }
    )

    }
    else{
      console.log("error in the form");
    }
  }
  captchaToken: string = '';

  onCaptchaResolved(event: any): void {
    const token = event?.token;  // Extract the token from the event
    this.captchaToken = token;
    console.log('Captcha Token:', token);
  }
  


  captchaUrl: SafeUrl | null = null; 
  loadCaptcha() {
    this.service.loadCaptcha().subscribe(
      (response: Blob) => {
        // Convert the Blob to a URL
        const blobUrl = URL.createObjectURL(response);
        this.captchaUrl = URL.createObjectURL(response);
        this.captchaUrl = this.dom.bypassSecurityTrustUrl(blobUrl);
      },
      (error) => {
        console.error('Error loading CAPTCHA:', error);
      }
    );
  }
}
