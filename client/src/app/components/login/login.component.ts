import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '../../services/common-services/toastr.service';
import { LoginManageService } from './../../services/login-management/login-manage.service';
import * as CryptoJS from 'crypto-js';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   LoginForm: FormGroup;
   messageText: string;
   messages: Array<any>;
   userState: any;
   constructor(private router: Router,
               public Toastr: ToastrService,
               private LoginService: LoginManageService) { }
   ngOnInit() {
      this.LoginForm = new FormGroup({
         User_Name: new FormControl(''),
         User_Password: new FormControl(''),
      });
   }

   // Login() {
   //    this.LoginService.User_login(this.LoginForm.getRawValue()).subscribe(response => {
   //       // this.router.navigate(['/Customer-Records']);
   //       if (response.Status) {
   //          localStorage.setItem('User', response.User);
   //          localStorage.setItem('User_Name', response.User_Name);
   //          this.router.navigate(['/customer-management/customer-records']);
   //          this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Login Successfully!' });
   //       } else {
   //          if (response.Message === undefined || response.Message === '' || response.Message === null) {
   //             this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
   //          }
   //       }
   //    });
   // }
   // }
   Login() {
      if (this.LoginForm.valid) {
         this.LoginService.User_login(this.LoginForm.getRawValue()).subscribe(response => {
            if (response.Status) {
               const UserData = CryptoJS.AES.decrypt(response.Response, response.Key.slice(3, 10)).toString(CryptoJS.enc.Utf8);
               localStorage.setItem('Session', response.Response);
               localStorage.setItem('SessionKey', response.Key);
               localStorage.setItem('SessionVerify', btoa(Date()));
               this.router.navigate(['/customer-management/customer-records']);
               this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Login Successfully!' });
            } else {
					localStorage.clear();
               if (response.Message === undefined || response.Message === '' || response.Message === null) {
                  response.Message = 'Some Error Occoured!, But not Identified.';
               }
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
            }
         });
      } else {
         this.LoginForm.controls.User_Name.markAsTouched();
         this.LoginForm.controls.User_Name.markAsDirty();
         this.LoginForm.controls.User_Password.markAsTouched();
         this.LoginForm.controls.User_Password.markAsDirty();
      }
   }
}
