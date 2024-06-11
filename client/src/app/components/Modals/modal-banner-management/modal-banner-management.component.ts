import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { BannerService } from '../../../services/banner/banner.service';
import { LoginManageService } from '../../../services/login-management/login-manage.service';

@Component({
   selector: 'app-modal-banner-management',
   templateUrl: './modal-banner-management.component.html',
   styleUrls: ['./modal-banner-management.component.css']
})
export class ModalBannerManagementComponent implements OnInit {

   @ViewChild('fileInput', {static: false}) fileInput: ElementRef;

   Type: string;
   Banner: any;
   BannerList: any[] = [];
   BannerForm: FormGroup;
   onClose: Subject<any>;
   Uploading = false;
   UserInfo: any;

   //  Crop Declare
   imageChangedEvent: any = '';
   croppedImage: any = '';
   Loadfailed: any = '';
   LoadImage: any = '';
   crop = false;
   User: any;

   constructor(public modalRef: BsModalRef,
               public Toastr: ToastrService,
               private LoginService: LoginManageService,
               private BannerService: BannerService) { } 

   ngOnInit() {
      this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
      this.onClose = new Subject();
      if (this.Type === 'Create') {
         this.BannerForm = new FormGroup({
            file: new FormControl('', Validators.required),
            title: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            User: new FormControl(this.UserInfo._id, Validators.required),
         });
      }

      if (this.Type === 'Edit') {
         this.BannerForm = new FormGroup({
            BannerId: new FormControl(this.Banner._id),
            file: new FormControl(this.Banner.Banner_file),
            title: new FormControl(this.Banner.Title),
            description: new FormControl(this.Banner.Description)
         });
      }
   }

   AutocompleteBlur(key: any) {
      setTimeout(() => {
         const value = this.BannerForm.controls[key].value;
         if (!value || value === null || value === '' || typeof value !== 'object') {
            this.BannerForm.controls[key].setValue(null);
         }
      }, 500);
   }

   fileChangeEvent(event: any): void {
      if (event.target.files && event.target.files.length > 0) {
         const reader = new FileReader();
         reader.readAsDataURL(event.target.files[0]);
         const file = event.target.files[0];
         if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/JPG' || file.type === 'image/JPEG' || file.type === 'image/PNG' || file.type === 'image/GIF') {
            this.imageChangedEvent = event;
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Warning', Message: 'Please Upload only .png, .jpg, .jpeg, .gif format files!'  });
            this.fileInput.nativeElement.value = '';
         }
      }
   }

   imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      this.BannerForm.controls.file.setValue(this.croppedImage);
   }
   // imageLoaded(LoaderSection) {
   // show cropper
   //   console.log('Loader Section');
   //   const originalContents = document.getElementById(LoaderSection).innerHTML;
   //   const originalContents = document.body.innerHTML;
   //   document.body.innerHTML = Loadcontent;
   //   document.body.innerHTML = originalContents;
   // }

   cropperReady() {
      // cropper ready

   }

   onSubmit() {
      if (this.Type === 'Create') {
         this.Submit();
      }
      if (this.Type === 'Edit') {
         this.Update();
      }
   }

   loadImageFailed() { }

   Submit() {
      if (this.BannerForm.valid && !this.Uploading) {
         this.Uploading = true;
         const Info = this.BannerForm.value;
         this.BannerService.Banner_Create(Info).subscribe(response => {
            this.Uploading = false;
            if (response.Status) {
               this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'New Banner Successfully Created' });
               this.onClose.next({ Status: true, Response: response.Response });
               this.modalRef.hide();
            } else {
               if (response.Message === undefined || response.Message === '' || response.Message === null) {
                  response.Message = 'Some Error Occoured!, But not Identified.';
               }
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
               this.onClose.next({ Status: false, Message: 'UnExpected Error!' });
               this.modalRef.hide();
            }
         });
      } else {
         Object.keys(this.BannerForm.controls).map(obj => {
            const FControl = this.BannerForm.controls[obj] as FormControl;
            if (FControl.invalid) {
               FControl.markAsTouched();
               FControl.markAsDirty();
            }
         });
      }
   }


   Update() {
      if (this.BannerForm.valid && !this.Uploading) {
         this.Uploading = true;
         const Info = this.BannerForm.value;
         this.BannerService.Banner_Update(Info).subscribe(response => {
            this.Uploading = false;
            if (response.Status) {
               this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Banner Details Successfully Updated' });
               this.onClose.next({ Status: true, Response: response.Response });
               this.modalRef.hide();
            } else {
               if (response.Message === undefined || response.Message === '' || response.Message === null) {
                  response.Message = 'Some Error Occoured!, But not Identified.';
               }
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.Message });
               this.onClose.next({ Status: false, Message: 'UnExpected Error!' });
               this.modalRef.hide();
            }
         });
      } else {
         Object.keys(this.BannerForm.controls).map(obj => {
            const FControl = this.BannerForm.controls[obj] as FormControl;
            if (FControl.invalid) {
               FControl.markAsTouched();
               FControl.markAsDirty();
            }
         });
      }
   }

   GetFormControlErrorMessage(KeyName: any) {
      const FControl = this.BannerForm.get(KeyName) as FormControl;
      if (FControl.invalid && FControl.touched) {
         const ErrorKeys: any[] = FControl.errors !== null ? Object.keys(FControl.errors) : [];
         if (ErrorKeys.length > 0) {
            let returnText = '';
            if (ErrorKeys.indexOf('required') > -1) {
               returnText = 'This field is required';
            } else {
               returnText = 'Undefined error detected!';
            }
            return returnText;
         } else {
            return '';
         }
      }
   }
}

