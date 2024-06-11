import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-upcomingorder-view',
  templateUrl: './modal-upcomingorder-view.component.html',
  styleUrls: ['./modal-upcomingorder-view.component.css']
})
export class ModalUpcomingorderViewComponent implements OnInit {

  onClose: Subject<any>;
  Info: any;
  OrderInfo: any;

  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
    this.onClose = new Subject();
  }
}
