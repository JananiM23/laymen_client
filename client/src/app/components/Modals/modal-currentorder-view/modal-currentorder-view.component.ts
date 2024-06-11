import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-currentorder-view',
  templateUrl: './modal-currentorder-view.component.html',
  styleUrls: ['./modal-currentorder-view.component.css']
})
export class ModalCurrentorderViewComponent implements OnInit {

   onClose: Subject<any>;
   Info: any;
   OrderInfo: any;

   constructor(public modalRef: BsModalRef) { }

   ngOnInit() {
     this.onClose = new Subject();
   }

}
