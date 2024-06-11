import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { DeliveryPersonDetailsService } from '../../../services/Deliveryboy-Management/delivery-person-details.service';
import { LoginManageService } from '../../../services/login-management/login-manage.service';
import { ToastrService } from '../../../services/common-services/toastr.service';
import { OrderManagementService } from '../../../services/order-management/order-details/order-management.service';
import { BsModalRef, BsModalService} from 'ngx-bootstrap';

import domtoimage from 'dom-to-image';
import * as jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
export interface Marker {  Latitude: number; Longitude: number; Icon: string; Data: any;}

@Component({
  selector: 'app-deliveryboy-tracking',
  templateUrl: './deliveryboy-tracking.component.html',
  styleUrls: ['./deliveryboy-tracking.component.css']
})
export class DeliveryboyTrackingComponent implements OnInit {

   @ViewChild('search', { static: false }) searchElementRef: ElementRef;
   @ViewChild('AgmMap', { static: false }) AgmMap: any;
   latitude: any;
   longitude: any;
   zoom = 20;
   disabled = false;
   DeliveryBoyList: any[] = [];
   UserInfo: any;
   OrderList: any[] = [];

   deliveryPersonDetails = null;
   deliveryReport = null;
   deliveryReportLoading = false;

   DownloadBtn = true;

   MarkersData: any[] = [];
   // tslint:disable-next-line: variable-name
   Order_Markers: any[] = [];
   // tslint:disable-next-line: variable-name
   Delivery_Markers: any[] = [];
   Icon: any;
   Data: any;

   isShow = false;
   orderShow = false;
   deliveryboyShow = false;
   ListShow = false;

   modalReference: BsModalRef;

   constructor(
      private LoginService: LoginManageService,
      public Toastr: ToastrService,
      private OrderService: OrderManagementService,
      private DeliveryboyService: DeliveryPersonDetailsService,
      public ModalService: BsModalService,
   ) {
      this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
      // this.InitialBoy();
      this.deliveryboyShow = true;

      this.OrderService.Deliveryboy_List({ User: this.UserInfo._id }).subscribe(response => {
         if (response.Status && response.Status === true) {
         this.DeliveryBoyList = response.Response;

         if ( this.DeliveryBoyList[0] && this.DeliveryBoyList[0].DeliveryPersonId && this.DeliveryBoyList[0].DeliveryPersonId !== '' && this.DeliveryBoyList[0].DeliveryPersonId !== null ) {
            this.MarkersData = [];
            this.ListShow = true;
            this.DeliveryBoyList.map(obj => {
               const markerIcon = 'assets/images/markers/D-locate.png';
               const marker = {
               Latitude: Number(obj.Latitude),
               Longitude: Number(obj.Longitude),
               Data: obj,
               Icon: markerIcon,
               };
               this.MarkersData.push(marker);
            });
         } else {
            this.ListShow = false;
         }

         } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
         if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
            response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
         }
         this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
         } else {
         this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Delivery boy Records Getting Error!, But not Identify!' });
         }
      });
   }

   ngOnInit() {
      // this.deliveryboyShow = true;
   }

   Track(index: any) {
      this.orderShow = true;
      this.deliveryboyShow = false;
      const Latitudes = this.DeliveryBoyList[index].Latitude;
      const Longitudes = this.DeliveryBoyList[index].Longitude;

      const DeliveryBoyId = this.DeliveryBoyList[index]._id;
      const DeliveryPerson_Name = this.DeliveryBoyList[index].DeliveryPerson_Name;
      // const Icon = 'assets/images/markers/D-locate.png';

      this.latitude = Latitudes;
      this.longitude = Longitudes;
      this.Icon = {
               url: 'assets/images/markers/D-locate.png',
               scaledSize: {
                  height: 60,
                  width: 30
               },
      };
      this.Data = DeliveryPerson_Name;


      this.OrderList = this.DeliveryBoyList[index].CustomerInfo;
      this.Order_Markers = [];
      this.OrderList.map(obj1 => {
         const markerIcon = 'assets/images/markers/order-circle.png';
         const ordermarker = {
         Latitude: Number(obj1.Latitude),
         Longitude: Number(obj1.Longitude),
         Data: obj1,
         Icon: markerIcon,
         };
         this.Order_Markers.push(ordermarker);
      });
   }

   InitialBoy() {
      this.OrderService.Deliveryboy_List({ User: this.UserInfo._id  }).subscribe(response => {
         if (response.Status && response.Status === true) {
            this.DeliveryBoyList = response.Response;
            this.MarkersData = [];
            this.DeliveryBoyList.map(obj => {
               const markerIcon = 'assets/images/markers/D-locate.png';
               const marker = {
                  Latitude: Number(obj.Latitude),
                  Longitude: Number(obj.Longitude),
                  Data: obj,
                  Icon: markerIcon,
               };
               this.MarkersData.push(marker);
            });
         } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
            if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
               response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
            }
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Delivery boy Records Getting Error!, But not Identify!' });
         }
      });
   }

   AllTrack(event: any) {
      this.InitialBoy();
      this.deliveryboyShow = true;
      this.orderShow = false;
      this.isShow = false;
   }

   OpenInfoWindow(index: number) {
      this.disabled = false;
   }

   CloseInfoWindow(index: number) {
      // this.ConfirmationData.SubIndex = null;
      // this.MarkersData[index].Routes_Type = '';
   }


   LoadDeliverReport(idx: any, template: TemplateRef<any>) {
      this.deliveryReportLoading = true;
      this.deliveryReport = null;
      const DeliveryId = this.DeliveryBoyList[idx].DeliveryPersonId;

      this.modalReference = this.ModalService.show(template, {ignoreBackdropClick: false, class: 'modal-lg modal-dialog-centered animated bounceInRight'} );

      this.OrderService.DeliveryPerson_TodayOrders({ DeliveryPersonId: DeliveryId}).subscribe(response => {
         if (response.Status && response.Status === true) {
            this.deliveryReportLoading = false;
            this.deliveryPersonDetails = response.DeliveryPersonDetails;
            this.deliveryPersonDetails.CustomersLength = response.Response.length;
            this.deliveryPersonDetails.SubLines = '-';
            this.deliveryReport = response.Response;
            const AllDelLines = [];
            this.deliveryReport.map(Obj => {
               AllDelLines.push(Obj.Delivery_Line.Deliveryline_Name);
            });
            let SubDeliveryLines = AllDelLines.reduce((a, b) => { if (a.indexOf(b) < 0 ) { a.push(b); } return a; }, []);
            SubDeliveryLines = SubDeliveryLines.filter(obj => obj !== this.deliveryPersonDetails.DeliveryLine.Deliveryline_Name);
            if (SubDeliveryLines.length > 0) {
               this.deliveryPersonDetails.SubLines = SubDeliveryLines.toString();
            }
         } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
            if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
               response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
            }
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
         } else {
            this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Delivery boy Records Getting Error!, But not Identify!' });
         }
      });
   }

   DownloadPdf() {
      this.DownloadBtn = false;
      setTimeout(() => {
         domtoimage.toBlob(document.getElementById('ModalDom'))
         .then( blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
               const doc = new jsPDF('p', 'mm');
               const base64data = reader.result;
               const pageWidth = doc.internal.pageSize.getWidth();
               const pageHeight =  doc.internal.pageSize.getHeight();
               const imgWeight =   document.getElementById('ModalDom').clientWidth;
               const imgHeight =   document.getElementById('ModalDom').clientHeight;
               const setImgHeight = imgHeight * pageWidth / imgWeight;
               let heightLeft = setImgHeight;
               let position = 0;

               doc.addImage(base64data, 'PNG', 0, position, pageWidth, setImgHeight);
               heightLeft -= pageHeight;

               while (heightLeft >= 0) {
                  position = heightLeft - setImgHeight;
                  doc.addPage();
                  doc.addImage(base64data, 'PNG', 0, position, pageWidth, setImgHeight);
                  heightLeft -= pageHeight;
               }
               doc.save('Delivery-Orders-Report.pdf');
            };
            this.DownloadBtn = true;
         });
      }, 100);
   }

}
