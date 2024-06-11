import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
@Component({
  selector: 'app-modal-basket-view',
  templateUrl: './modal-basket-view.component.html',
  styleUrls: ['./modal-basket-view.component.css']
})
export class ModalBasketViewComponent implements OnInit {

  onClose: Subject<any>;
  Data: any;
  Type: any;

  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
  }
}
