import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-modal-collection-approve',
  templateUrl: './modal-collection-approve.component.html',
  styleUrls: ['./modal-collection-approve.component.css']
})
export class ModalCollectionApproveComponent implements OnInit {
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
