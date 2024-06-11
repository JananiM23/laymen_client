import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FormGroup, FormControl, FormArray, AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from '../../../services/common-services/toastr.service';
// import { UserManagementService } from '../../../services/user-management/user-management.service';
import { CustomerDetailsService } from '../../../services/customer-management/customer-details/customer-details.service';
import { LoginManageService } from '../../../services/login-management/login-manage.service';

@Component({
  selector: 'app-modal-customer-analytics',
  templateUrl: './modal-customer-analytics.component.html',
  styleUrls: ['./modal-customer-analytics.component.css']
})
export class ModalCustomerAnalyticsComponent implements OnInit {
  UserInfo: any;
  AnalyticForm: FormGroup;
  onClose: Subject<any>;
  Type: string;
  Uploading = false;
  // tslint:disable-next-line: variable-name
  Questions_List: any;
  Answer: FormArray;
  FArrays: any[] = ['Answer'];
  Question: any;
  DeliveryPerson: any;
  get: any;
  constructor(
    public Toastr: ToastrService,
    public modalRef: BsModalRef,
    private Service: CustomerDetailsService,
    public LoginService: LoginManageService) {
    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());

  }

  ngOnInit() {
    this.onClose = new Subject();
    if (this.Type === 'Create') {
      this.AnalyticForm = new FormGroup({
        Question: new FormControl('', Validators.required),
        Answer: new FormArray([this.createQuestions()]),
        User: new FormControl(this.UserInfo._id, Validators.required),
        Region: new FormControl(this.UserInfo.Region, Validators.required)
      });
    }
    if (this.Type === 'Edit') {

      this.AnalyticForm = new FormGroup({
        QuestionId: new FormControl(this.Questions_List._id),
        Question: new FormControl(this.Questions_List.Question, Validators.required),
        Answer: new FormControl(this.editAnswers(this.Questions_List.Answer)),
        User: new FormControl(this.UserInfo._id, Validators.required),
      });
    }
  }

  onSubmit() {
    if (this.Type === 'Create') {
      this.Submit();
    }
    if (this.Type === 'Edit') {
      this.Update();
    }
  }

  Submit() {
    if (this.AnalyticForm.valid && !this.Uploading) {
      this.Uploading = true;
      const Info = this.AnalyticForm.value;
      this.Service.Analytics_Create(Info).subscribe(response => {
          this.Uploading = false;
          if (response.Status) {
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: response.Message });
            this.onClose.next({ Status: true, Response: response.Response });
            this.modalRef.hide();
          } else {
            if (response.error.Message === undefined || response.error.Message === '' || response.error.Message === null) {
                response.error.Message = 'Some Error Occoured!, But not Identified.';
            }
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.error.Message });
            // this.onClose.next({ Status: false, Message: 'UnExpected Error!' });
            // this.modalRef.hide();
          }
      });
    } else {
      Object.keys(this.AnalyticForm.controls).map(obj => {
          const FControl = this.AnalyticForm.controls[obj] as FormControl;
          if (FControl.invalid) {
            FControl.markAsTouched();
            FControl.markAsDirty();
          }
      });
    }
  }

  Update() {
    if (this.AnalyticForm.valid && !this.Uploading) {
      this.Uploading = true;
      const Info = this.AnalyticForm.value;
      this.Service.Analytic_Update(Info).subscribe(response => {
          this.Uploading = false;
          if (response.Status) {
            this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Customer QA Config Details Successfully Updated' });
            this.onClose.next({ Status: true, Response: response.Response });
            this.modalRef.hide();
          } else {
            if (response.error.Message === undefined || response.error.Message === '' || response.error.Message === null) {
                response.error.Message = 'Some Error Occoured!, But not Identified.';
            }
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.error.Message });
            this.onClose.next({ Status: false, Message: 'UnExpected Error!' });
            this.modalRef.hide();
          }
      });
    } else {
      Object.keys(this.AnalyticForm.controls).map(obj => {
          const FControl = this.AnalyticForm.controls[obj] as FormControl;
          if (FControl.invalid) {
            FControl.markAsTouched();
            FControl.markAsDirty();
          }
      });
    }
  }

  GetFormControlErrorMessage(KeyName: any) {
    const FControl = this.AnalyticForm.get(KeyName) as FormControl;
    if (FControl.invalid && FControl.touched) {
      const ErrorKeys: any[] = FControl.errors !== null ? Object.keys(FControl.errors) : [];
      if (ErrorKeys.length > 0) {
          let returnText = '';
          if (ErrorKeys.indexOf('required') > -1) {
            returnText = 'This field is required';
          } else if (ErrorKeys.indexOf('min') > -1) {
            returnText = 'Enter the value should be more than ' + FControl.errors.min.min;
          } else if (ErrorKeys.indexOf('NumericsError') > -1) {
            returnText = 'Please Enter Only Numerics!';
          } else if (ErrorKeys.indexOf('minlength') > -1) {
            returnText = 'Enter the value should be greater than ' + FControl.errors.minlength.requiredLength + ' Digits/Characters';
          } else if (ErrorKeys.indexOf('maxlength') > -1) {
            returnText = 'Enter the value should be less than ' + FControl.errors.maxlength.requiredLength + ' Digits/Characters';
          } else {
            returnText = 'Undefined error detected!';
          }
          return returnText;
      } else {
          return '';
      }
    }
  }


  createQuestions(): FormGroup {
    return new FormGroup({
      Answer: new FormControl('', Validators.required)
    });
  }

  addAnswers(): void {
    this.Answer = this.AnalyticForm.get('Answer') as FormArray;
    this.Answer.push(this.createQuestions());
  }

  removeAnswers(index: any) {
    this.Answer.removeAt(index);
  }

  editAnswers(array: any[]) {
    const FArrays = this.AnalyticForm.controls.Answer as FormArray;
    if (array.length > 0) { FArrays.removeAt(0); }
    array.map(obj => {
      const FGroup = new FormGroup({
        Answer: new FormControl(obj.Answer)
      });
      FArrays.push(FGroup);
    });
  }

  GetFormArray(ControlName: any): any[] {
    const FArrays = this.AnalyticForm.get(ControlName) as FormArray;
    console.log(FArrays);
    return FArrays.controls;
  }
}
