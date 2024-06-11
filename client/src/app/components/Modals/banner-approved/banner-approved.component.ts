import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-banner-approved',
  templateUrl: './banner-approved.component.html',
  styleUrls: ['./banner-approved.component.css']
})
export class BannerApprovedComponent implements OnInit {

  onClose: Subject<any>;

  Icon = '';
  ColorCode = '';
  TextOne = '';
  TextTwo = '';
  TextThree = '';
  TextDescription = '';

  constructor(public ModalRef: BsModalRef) { }

  ngOnInit() {
     this.onClose = new Subject();
  }
  Cancel() {
     this.onClose.next({Status: false});
     this.ModalRef.hide();
  }
  Proceed() {
     this.onClose.next({Status: true});
     
     this.ModalRef.hide();

  }
}
