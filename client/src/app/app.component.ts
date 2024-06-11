import { Component,Input, ViewChild } from '@angular/core';
import { filter, pairwise } from 'rxjs/operators';
import { MatSidenav } from '@angular/material';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { LoginManageService } from './services/login-management/login-manage.service';
import { ToastrService } from './services/common-services/toastr.service';
import { DataPassingService } from './services/common-services/data-passing.service';
import { UserManagementService } from './services/user-management/user-management.service';
@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css']
})
export class AppComponent {
   title = 'Vilfresh';

   @ViewChild('SideNav', { static: false }) SideNav: MatSidenav;

   showGroup = true;
   User_Name: any;
   UserLoggedIn: boolean;

   UserInfo: any;


   ToastrList: any[] = [];
   Notification: any[] = [];
   ShowNotifyPanel = false;
   NotifyCount = 0;
   ShowNotification = false;

   constructor(private router: Router,
               private LoginService: LoginManageService,
               public Toastr: ToastrService,
               public UserService: UserManagementService,
               private DataPassing: DataPassingService
      ) {
      this.User_Name = localStorage.getItem('User_Name');
      this.DataPassing.UpdateCustomerNameData('');
      this.DataPassing.UpdateCustomerUniqueData('');
      // Find Page Url
      router.events.subscribe(event => {
         if (event instanceof NavigationEnd) {
            if (event.url === '/login' || event.url === '/') {
               this.UserLoggedIn = false;
            } else {
               this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
               this.UserLoggedIn = true;
               this.ShowNotification = true;
               this.GetNotifyCount();

               if (sessionStorage.getItem('NavOpen') && sessionStorage.getItem('NavOpen') === 'No') {
                  // this.SideNav.close();
               } else {
                  // this.SideNav.open();
               }
            }
         }
      });

      this.router.events.pipe(filter((e: any) => e instanceof RoutesRecognized), pairwise()).subscribe((e: any) => {
         const PreviousRoutsArr = e[0].urlAfterRedirects.split('/');
         const CurrentRoutsArr = e[1].urlAfterRedirects.split('/');
         // tslint:disable-next-line:max-line-length
         if (PreviousRoutsArr[1] && (PreviousRoutsArr[1] === 'Customer-Records' || PreviousRoutsArr[1] === 'Customer-Create') && CurrentRoutsArr[1] && (CurrentRoutsArr[1] !== 'Customer-Manage' && PreviousRoutsArr[1] !== 'Customer-View')) {
            this.DataPassing.UpdateCustomerNameData('');
            this.DataPassing.UpdateCustomerUniqueData('');
         }
      });
      // Toastr Message
      this.Toastr.WaitingToastr.subscribe(Message => {
         setTimeout(() => {
            this.ToastrList.push(Message);
            this.RefreshToastrPosition();
            setTimeout(() => {
               this.ToastrList.splice(0, 1);
               this.RefreshToastrPosition();
            }, 3000);
         }, 100);
      });
   }

   HideToastr(index) {
      this.ToastrList[index].Type = 'Hidden';
      this.RefreshToastrPosition();
   }

   RefreshToastrPosition() {
      let Count = 0;
      this.ToastrList.map(toastr => {
         if (toastr.Type !== 'Hidden') {
            toastr.Top = Count * 80 + 10; Count = Count + 1;
         }
      });
   }



   SideNavToggle() {
      if (this.SideNav.opened) {
         this.SideNav.close();
         sessionStorage.setItem('NavOpen', 'No');
      } else {
         this.SideNav.open();
         sessionStorage.setItem('NavOpen', 'Yes');
      }
   }

   NotifyPanelToggle() {
      this.ShowNotifyPanel = !this.ShowNotifyPanel;
      this.GetNotifyCount();
   }

   GetNotificationList() {
      const data = { User: this.UserInfo._id };
      this.UserService.AllNotification_List(data).subscribe(NewResponse => {
         if (NewResponse.Status) {
            this.Notification = NewResponse.Response;
         } else {
            this.Notification = [];
         }
      });
   }

   GetNotifyCount() {
      const data = { User: this.UserInfo._id };
      this.UserService.Notification_Counts(data).subscribe(CountResponse => {
         if (CountResponse.Status) {
            this.NotifyCount = CountResponse.Response;
         } else {
            this.NotifyCount = 0;
         }
      });
   }

   DeleteAllRead() {
      const data = { User: this.UserInfo._id };
      this.UserService.DeleteAllRead(data).subscribe(NewResponse => {
         if (NewResponse.Status) {
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: NewResponse.Message });
            this.Notification = NewResponse.Response;
            this.NotifyPanelToggle();
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Warning', Message: 'Some Occurred error' });
            this.Notification = [];
         }
      });
   }

   MarkAllAsRead() {
      const data = { User: this.UserInfo._id };
      this.UserService.MarkAllAsRead(data).subscribe(NewResponse => {
         if (NewResponse.Status) {
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: NewResponse.Message });
            this.Notification = NewResponse.Response;
            this.GetNotifyCount();
            this.GetNotificationList();
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Warning', Message: 'Some Occurred error' });
            this.Notification = [];
         }
      });
   }
   Redirect(id: any, idx: any) {
      if (id !== '') {
         const data = { User: this.UserInfo._id, Notification: this.Notification[idx]._id };
         this.UserService.Read_Notification(data).subscribe(NewResponse => { });
         this.NotifyPanelToggle();
         this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
            this.router.navigate(['/customer-management/customer-view', id])
         );
      }
   }

   LogOut() {
      localStorage.clear();
      this.router.navigate(['/login']);
   }






}

