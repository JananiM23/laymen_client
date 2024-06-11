import { Component, OnInit, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { LoginManageService } from '../../../services/login-management/login-manage.service';
import { VilfreshBasketService } from '../../../services/vilfresh-basket/vilfresh-basket.service';
import { ToastrService } from './../../../services/common-services/toastr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-purchase-alert',
  templateUrl: './modal-purchase-alert.component.html',
  styleUrls: ['./modal-purchase-alert.component.css']
})
export class ModalPurchaseAlertComponent implements OnInit {

  onClose: Subject<any>;
  UserInfo: any;

  Icon = '';
  ColorCode = '';
  TextOne = '';
  TextTwo = '';
  TextThree = '';
  TextDescription = '';
  Type = '';
  NoLimitCustomers: any[] = [];
  CreditCustomers: any[] = [];
  WalletCustomers: any[] = [];

  Data: any[] = [];
  LowCustomers: any[] = [];
  modalReference: BsModalRef;

  Date: any;
  values = '';
  AssignDate: any;
  BasketDetails: any[] = [];

  constructor(public ModalRef: BsModalRef,
              private LoginService: LoginManageService,
              private Service: VilfreshBasketService,
              private Toastr: ToastrService,
              public router: Router,
              public ModalService: BsModalService) {
              this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
              const Current = new Date();
              this.AssignDate = Current;
              this.AssignDate.setDate(this.AssignDate.getDate() + 2);
  }

  ngOnInit() {
    this.onClose = new Subject();

  }
  Cancel() {
    this.onClose.next({ Status: false });
    this.ModalRef.hide();
  }
  Proceed() {
    this.onClose.next({ Status: true });
    const Data = {
      // User: this.UserInfo._id,
      FormValue: this.Data
    };
    this.Service.VBasket_POGenerate(this.Data).subscribe(response => {
      if (response.Status && response.Status === true) {
        this.BasketDetails = response.Response;
        this.router.navigate(['/order-management/purchase-records']);
      } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
        if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
          response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
        }
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
      } else {
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Getting Error While Generating Order !' });
      }
    });
    this.ModalRef.hide();
  }

  WalletCustomer(WalletCustom: TemplateRef<any>) {
    this.modalReference = this.ModalService.show(WalletCustom, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' });
    this.modalReference.hide();
  }

  CreditCustomer(CreditCustom: TemplateRef<any>) {
    this.modalReference = this.ModalService.show(CreditCustom, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' });
    this.modalReference.hide();
  }

  NoLimitCustomer(NoLimitCustom: TemplateRef<any>) {
    this.modalReference = this.ModalService.show(NoLimitCustom, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' });
    this.modalReference.hide();
  }

}
