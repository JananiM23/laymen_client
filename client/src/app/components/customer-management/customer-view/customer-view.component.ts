import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService} from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataPassingService } from 'src/app/services/common-services/data-passing.service';
import { CustomerDetailsService } from 'src/app/services/customer-management/customer-details/customer-details.service';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit {
  private dataSubscription: Subscription = new Subscription();

  @ViewChild('AgmMap', {static: false} ) AgmMap: any;

  latitude = 0;
  longitude = 0;
  zoom = 14;

  CustomerDetails: any;
  id: string;
  UrlParams = null;

  modalReference: BsModalRef;
  HospitalListData: any[] = [];

  constructor(private route: ActivatedRoute,
              public ModalService: BsModalService,
              private dataPassingService: DataPassingService,
              private CustomerService: CustomerDetailsService,
              public ActiveRoute: ActivatedRoute) {
            this.UrlParams = this.ActiveRoute.snapshot.params;
            const ParamsArr = Object.keys(this.UrlParams);
            this.dataSubscription.add(
                this.dataPassingService.AllFields.subscribe( response => {
                const DataObj = { CustomerId: this.UrlParams.id };
                this.CustomerService.Customer_view(DataObj).subscribe( CustomerRes =>  {
                if (CustomerRes.Status) {
                      this.CustomerDetails = CustomerRes.Response;
                      this.latitude = this.CustomerDetails.Latitude;
                      this.longitude = this.CustomerDetails.Longitude;
                  }
              });
        }));
    }
  ngOnInit() {}

}
