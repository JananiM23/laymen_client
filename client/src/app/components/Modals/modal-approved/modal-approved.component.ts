import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-approved',
  templateUrl: './modal-approved.component.html',
  styleUrls: ['./modal-approved.component.css']
})
export class ModalApprovedComponent implements OnInit {

   @HostListener('window:keydown.esc', ['$event'])
   onEsc(event: any): void {
      if (event.keyCode === 27) {
         this.Cancel();
         event.preventDefault();
      }
   }

   onClose: Subject<any>;

   Icon = '';
   ColorCode = '';
   Text= 'Are You Sure!';
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
