import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-config-view',
  templateUrl: './modal-config-view.component.html',
  styleUrls: ['./modal-config-view.component.css']
})
export class ModalConfigViewComponent implements OnInit {

  onClose: Subject<any>;
  Info: any;
  Type: any;

  constructor(public modalRef: BsModalRef) {  }

  ngOnInit() {
    this.onClose = new Subject();
  }
}
