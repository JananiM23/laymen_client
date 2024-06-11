import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject, Observable } from 'rxjs';


@Component({
  selector: 'app-modal-credit-management-view',
  templateUrl: './modal-credit-management-view.component.html',
  styleUrls: ['./modal-credit-management-view.component.css']
})
export class ModalCreditManagementViewComponent implements OnInit {
  Type: string;
  CreditHistoryView: any;
  onClose: Subject<any>;


  constructor(
    public modalRef: BsModalRef,

  ) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

}
