import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { UserManagementService } from '../../../services/user-management/user-management.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalUserViewComponent } from '../../Modals/modal-user-view/modal-user-view.component';
@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit {
   @ViewChild('TableHeaderSection', {static: false}) TableHeaderSection: ElementRef;
   @ViewChild('TableBodySection', {static: false}) TableBodySection: ElementRef;
   @ViewChild('TableLoaderSection', {static: false}) TableLoaderSection: ElementRef;
    
   UserDetails: any[] = [];
   PageLoader = true;
   CurrentIndex = 1;
   SkipCount = 0;
   SerialNoAddOn = 0;
   LimitCount = 5;
   ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
   PagesArray = [];
   TotalRows = 0;
   LastCreation: Date = new Date();
   PagePrevious: object = { Disabled: true, value : 0, Class: 'PageAction_Disabled'};
   PageNext: object = { Disabled: true, value : 0, Class: 'PageAction_Disabled'};
   SubLoader = false;
   GoToPage = null;

   modalReference: BsModalRef;
   UserList: any[] = [];
 
   THeaders: any[] = [ { Key: '_id', ShortKey: '_id', Name: 'User ID', If_Short: false, Condition: '' },
     { Key: 'User_Name', ShortKey: 'User_Name', Name: 'User Name', If_Short: false, Condition: '' },
     { Key: 'Phone', ShortKey: 'Phone', Name: 'Mobile Number', If_Short: false, Condition: '' },
     { Key: 'User_Type', ShortKey: 'User_Type', Name: 'User Type', If_Short: false, Condition: '' }];

  constructor(private Toastr: ToastrService,
              private renderer: Renderer2,
              private UserService: UserManagementService,
              public ModalService: BsModalService) {  
              this.Service_Loader(); }

  ngOnInit() {
  }

 
  Service_Loader() {
   let ShortOrderKey = '';
   let ShortOrderCondition = '';
   this.THeaders.map(obj => {
      if (obj.If_Short === true) { ShortOrderKey = obj.ShortKey; ShortOrderCondition = obj.Condition;  }
   });
   const Data = { Skip_Count: this.SkipCount,
                  Limit_Count: this.LimitCount,
                  ShortKey: ShortOrderKey,
                  ShortCondition: ShortOrderCondition,
               };
   this.TableLoader();
   this.UserService.Users_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true ) {
         this.UserDetails = response.Response;
         setTimeout(() => {
            this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'display', 'none');
         }, 10);
         this.TotalRows = response.SubResponse;
         this.Pagination_Affect();
      } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
         if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
            response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
         }
         this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
      } else {
         this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'User Records Getting Error!, But not Identify!' });
      }
   });
}

 
TableLoader() {
   setTimeout(() => {
      const Top = this.TableHeaderSection.nativeElement.offsetHeight - 2;
      const Height = this.TableBodySection.nativeElement.offsetHeight + 4;
      this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'display', 'flex');
      this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'height', Height + 'px');
      this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'line-height', Height + 'px');
      this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'top', Top + 'px');
   }, 10);
 }
 

 Pagination_Affect() {
   const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
   const PrevClass = (this.CurrentIndex > 1 ? '' : 'PageAction_Disabled');
   this.PagePrevious = { Disabled: !(this.CurrentIndex > 1), Value : (this.CurrentIndex - 1), Class: PrevClass};
   const NextClass = (this.CurrentIndex < NoOfArrays ? '' : 'PageAction_Disabled');
   this.PageNext = { Disabled: !(this.CurrentIndex < NoOfArrays), Value : (this.CurrentIndex + 1), Class: NextClass};
   this.PagesArray = [];
   for (let index = 1; index <= NoOfArrays ; index++) {
      if (index === 1) {
         this.PagesArray.push({Text: '1', Class: 'Number', Value: 1, Show: true, Active: (this.CurrentIndex === index ) });
      }
      if (index > 1 && NoOfArrays > 2 && index < NoOfArrays ) {
         if (index === (this.CurrentIndex - 2)) {
            this.PagesArray.push({Text: '...', Class: 'Dots', Show: true, Active: false });
         }
         if (index === (this.CurrentIndex - 1) ) {
            this.PagesArray.push({Text: (this.CurrentIndex - 1).toString(), Class: 'Number',  Value: index, Show: true, Active: false });
         }
         if (index === this.CurrentIndex) {
            this.PagesArray.push({Text: this.CurrentIndex.toString(), Class: 'Number', Value: index, Show: true, Active: true });
         }
         if (index === (this.CurrentIndex + 1) ) {
            this.PagesArray.push({Text: (this.CurrentIndex + 1).toString(), Class: 'Number', Value: index, Show: true, Active: false });
         }
         if (index === (this.CurrentIndex + 2)) {
            this.PagesArray.push({Text: '...', Class: 'Dots', Show: true, Active: false });
         }
      }
      if (index === NoOfArrays && NoOfArrays > 1) {
         this.PagesArray.push({Text: NoOfArrays.toString(), Class: 'Number', Value: NoOfArrays, Show: true, Active: (this.CurrentIndex === index ) });
      }
   }
   let ToCount = this.SkipCount + this.LimitCount;
   if (ToCount > this.TotalRows) { ToCount = this.TotalRows; }
   this.ShowingText = 'Showing <span>' + (this.SkipCount + 1) + '</span> to <span>' + ToCount + '</span> out of <span>' + this.TotalRows + '</span>  entries';
 }

 Pagination_Action(index: any) {
   const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
   if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.Service_Loader();
   }
}

Short_Change(index: any) {
   if (this.THeaders[index].If_Short !== undefined && !this.THeaders[index].If_Short) {
      this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Ascending';
      this.Pagination_Action(1);
   } else if (this.THeaders[index].If_Short !== undefined && this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Ascending') {
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Descending';
      this.Pagination_Action(1);
   } else if (this.THeaders[index].If_Short !== undefined && this.THeaders[index].If_Short && this.THeaders[index].Condition === 'Descending') {
      this.THeaders[index].If_Short = true;
      this.THeaders[index].Condition = 'Ascending';
      this.Pagination_Action(1);
   } else {
      this.THeaders = this.THeaders.map(obj => { obj.If_Short = false; obj.Condition = ''; return obj; });
      this.Pagination_Action(1);
   }
}



 ViewCustomer(index: any) {
   const initialState = {
      Info: this.UserDetails[index]
   };
   this.modalReference = this.ModalService.show(ModalUserViewComponent, Object.assign({initialState}, {ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
   this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
         this.UserDetails[index] = response.Response;
      }
   });
}

 
 Success() {
   this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Success Message! Everything is working Good' });
 }
 
 Info() {
   this.Toastr.NewToastrMessage({ Type: 'Info', Message: 'Info Message! This is just for Information' });
 }
 
 Warning() {
   this.Toastr.NewToastrMessage({ Type: 'Warning', Message: 'Warning Message! Don`t do this again' });
 }
 
 Error() {
   this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Error Message! Some error occured' });
 }

}
