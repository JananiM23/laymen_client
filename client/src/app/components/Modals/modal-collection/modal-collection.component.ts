import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-collection',
  templateUrl: './modal-collection.component.html',
  styleUrls: ['./modal-collection.component.css']
})
export class ModalCollectionComponent implements OnInit {

  CollectionDetails: any;
  onClose: Subject<any>;
  Type: string;
  Uploading = false;
  User: any;
  UserInfo: any;
  constructor(   public modalRef: BsModalRef) { }

  ngOnInit() {
    this.onClose = new Subject();

  }

}
