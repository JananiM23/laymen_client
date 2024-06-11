import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService} from 'ngx-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataPassingService } from 'src/app/services/common-services/data-passing.service';
import { CustomerDetailsService } from 'src/app/services/customer-management/customer-details/customer-details.service';
import { WalletRecordsComponent } from '../../Modals/Modal-WalletHistory/wallet-records/wallet-records.component';
import { ModalCreditManagementComponent } from '../../Modals/Modal-CreditHistory/modal-credit-management/modal-credit-management.component';
import { WalletDetailsService } from 'src/app/services/wallet-details/wallet-details.service';
import { ToastrService } from 'src/app/services/common-services/toastr.service';
import { FormGroup } from '@angular/forms';

export interface Customers { _id: string; Customer_Name: string; }
export interface Delivery_Line {  _id: string;  Deliveryline_Name: string; }

interface products {
	date: string;
	productname: string;
	quantity: number;
	description: string;
  sts:string;
	total: number;
}

interface credits {
	date: string;
	productname: string;
	quantity: number;
	description: string;
  creditlmt:number;
  spent:number;
  available:number;
}

interface wallet {
	date: string;
	productname: string;
	quantity: number;
	description: string;
  waltlmt:number;
  spent:number;
  available:number;
}

const Purchased: products[] = [
	{
		date: '1/2/23',
		productname: 'Oil',
		quantity: 1,
    description:'Get your cholesterol levels down',
    sts:'Reduced by Credit',
		total: 70,
	},
	{
		date: '2/2/23',
		productname: 'Curd',
		quantity: 1,
    description:'The goodness of nature',
    sts:'Reduced by Credit',
		total: 25,
	},
	{
		date: '3/2/23',
		productname: 'Milk',
		quantity: 1,
    description:'Drink milk, live strong.',
    sts:'Reduced by Credit',
		total: 35,
	},
	{
		date: '4/2/23',
		productname: 'Sugar',
		quantity: 1,
    description:'Sweet is never enough',
    sts:'Reduced by Credit',
		total: 40,
	},
];

const CREDITS : credits[]=[
  {
    date: '1/2/23',
		productname: 'Oil',
		quantity: 1,
    description:'Get your cholesterol levels down',
		creditlmt: 170,
    spent:70,
    available:70
  },
  {
    date: '2/2/23',
		productname: 'Curd',
		quantity: 1,
    description:'The goodness of nature',
		creditlmt: 170,
    spent:25,
    available:70
  },
  {
    date: '3/2/23',
		productname: 'Milk',
		quantity: 1,
    description:'Drink milk, live strong.',
		creditlmt: 170,
    spent:35,
    available:70
  },
  {
    date: '4/2/23',
		productname: 'Sugar',
		quantity: 1,
    description:'Sweet is never enough',
		creditlmt: 170,
    spent:40,
    available:70
  }
]


const wallet :wallet[]=[
  {
    date: '1/2/23',
		productname: 'Oil',
		quantity: 1,
    description:'Get your cholesterol levels down',
		waltlmt: 700,
    spent:0,
    available:70
  },
  {
    date: '2/2/23',
		productname: 'Curd',
		quantity: 1,
    description:'The goodness of nature',
		waltlmt: 700,
    spent:0,
    available:70
  },
  {
    date: '3/2/23',
		productname: 'Milk',
		quantity: 1,
    description:'Drink milk, live strong.',
		waltlmt: 700,
    spent:0,
    available:70
  },
  {
    date: '4/2/23',
		productname: 'Sugar',
		quantity: 1,
    description:'Sweet is never enough',
		waltlmt: 700,
    spent:0,
    available:70
  }
]
@Component({
  selector: 'app-payment-detailed-view',
  templateUrl: './payment-detailed-view.component.html',
  styleUrls: ['./payment-detailed-view.component.css']
})
export class PaymentDetailedViewComponent implements OnInit {

products = Purchased;
Credit =CREDITS ;
wallt=wallet;

  private dataSubscription: Subscription = new Subscription();

  @ViewChild('TableHeaderSection', {static: false}) TableHeaderSection: ElementRef;
  @ViewChild('TableBodySection', {static: false}) TableBodySection: ElementRef;
  @ViewChild('TableLoaderSection', {static: false}) TableLoaderSection: ElementRef;

  PageLoader = true;
  CurrentIndex = 1;
  UserInfo: any;
  SkipCount = 0;
  SerialNoAddOn = 0;
  LimitCount = 5;
  ShowingText = 'Showing <span>0</span> to <span>0</span> out of <span>0</span> entries';
  PagesArray = [];
  TotalRows = 0;
  WalletDetails: any[] = [];
  LastCreation: Date = new Date();
  PagePrevious: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  PageNext: object = { Disabled: true, value: 0, Class: 'PageAction_Disabled' };
  SubLoader = false;
  GoToPage = null;
  CustomerDetails: any;
  id: string;
  UrlParams = null;

  modalReference: BsModalRef;
  HospitalListData: any[] = [];

  constructor(private route: ActivatedRoute,
    private routes :Router,
    private WalletService: WalletDetailsService,
              public ModalService: BsModalService,
              private Toastr: ToastrService,
              private renderer: Renderer2,
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
                  }
              });
        }));
    }
  ngOnInit() {}

  ProdHeaders: any[] = [{ Key: 'createdAt', ShortKey: 'createdAt', Name: 'Date', If_Short: false, Condition: '' },
                     { Key: 'products', ShortKey: 'products', Name: 'Products', If_Short: false, Condition: '' },
                     { Key: 'quantity', ShortKey: 'quantity', Name: 'Quantity', If_Short: false, Condition: '' },
                     { Key: 'description', ShortKey: 'description', Name: 'Description', If_Short: false, Condition: '' },
                     { Key: 'Status', ShortKey: 'Status', Name: 'Status', If_Short: false, Condition: '' },
                     { Key: 'sub_total', ShortKey: 'sub_total', Name: 'Sub Total', If_Short: false, Condition: '' },
                     ];

                     CredHeaders: any[] = [{ Key: 'createdAt', ShortKey: 'createdAt', Name: 'Date', If_Short: false, Condition: '' },
                     { Key: 'products', ShortKey: 'products', Name: 'Products', If_Short: false, Condition: '' },
                     { Key: 'quantity', ShortKey: 'quantity', Name: 'Quantity', If_Short: false, Condition: '' },
                     { Key: 'description', ShortKey: 'description', Name: 'Description', If_Short: false, Condition: '' },
                     { Key: 'credit_limit', ShortKey: 'credit_limit', Name: 'Credit Limit', If_Short: false, Condition: '' },
                     { Key: 'spent', ShortKey: 'spent', Name: 'Spent', If_Short: false, Condition: '' },
                     { Key: 'available_limit', ShortKey: 'available_limit', Name: 'Available Limit', If_Short: false, Condition: '' },
                     ];

                     WallHeaders: any[] = [{ Key: 'createdAt', ShortKey: 'createdAt', Name: 'Date', If_Short: false, Condition: '' },
                     { Key: 'products', ShortKey: 'products', Name: 'Products', If_Short: false, Condition: '' },
                     { Key: 'quantity', ShortKey: 'quantity', Name: 'Quantity', If_Short: false, Condition: '' },
                     { Key: 'description', ShortKey: 'description', Name: 'Description', If_Short: false, Condition: '' },
                     { Key: 'wallet_limit', ShortKey: 'wallet_limit', Name: 'Wallet Limit', If_Short: false, Condition: '' },
                     { Key: 'spent', ShortKey: 'spent', Name: 'Spent', If_Short: false, Condition: '' },
                     { Key: 'available_limit', ShortKey: 'available_limit', Name: 'Available Limit', If_Short: false, Condition: '' },
                     ];

                     FiltersArray: any[] = [
                      { Active: false, Key: 'Customer', Value: '', DisplayName: 'Customer', DBName: 'Customer', Type: 'Object', Option: '' },
                      { Active: false, Key: 'Added_Type', Value: '', DisplayName: 'Payment Type', DBName: 'Added_or_Reduced', Type: 'String', Option: '' },
                      { Active: false, Key: 'Added_From', Value: null, DisplayName: 'From Date', DBName: 'Date', Type: 'Date', Option: 'GTE' },
                      { Active: false, Key: 'Added_To', Value: null, DisplayName: 'To Date', DBName: 'Date', Type: 'Date', Option: 'LTE' }
                    ];
                  
                    FilterFGroupStatus = false;
                    FilterFGroup: FormGroup;

  goback(){
    this.routes.navigate(['/payment-management/payment-records'])
  }

  Pagination_Action(index: any) {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    if ((index >= 1 && NoOfArrays >= index) || NoOfArrays === 0) {
      this.CurrentIndex = index;
      this.SkipCount = this.LimitCount * (this.CurrentIndex - 1);
      this.Service_Loader();
    }
  }
  AddVilfreshMoney() {
    const initialState = { Type: 'Create', CustomerDetails: this.CustomerDetails };
    this.modalReference = this.ModalService.show(WalletRecordsComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated bounceInRight' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        // this.Pagination_Action(1);
      }
    });
  }

  AddCreditMoney() {
    const initialState = { Type: 'Create', CustomerDetails: this.CustomerDetails };
    this.modalReference = this.ModalService.show(ModalCreditManagementComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated bounceInRight' }));
    this.modalReference.content.onClose.subscribe(response => {
      if (response.Status) {
        // this.Pagination_Action(1);
      }
    });
  }

  ViewWallet(index: any) {
    const initialState = {
      Type: 'View',
      Wallet: this.WalletDetails[index]
    };
    // this.modalReference = this.ModalService.show(ModalWalletManagementComponent,
    //   Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated bounceInRight' }));
    // this.modalReference.content.onClose.subscribe(response => {
    //   if (response.Status) {
    //     this.WalletDetails[index] = response.Response;
    //   }
    // });
  }

  Service_Loader() {
    let ShortOrderKey = '';
    let ShortOrderCondition = '';
    this.CredHeaders.map(obj => {
      if (obj.If_Short === true) { ShortOrderKey = obj.ShortKey; ShortOrderCondition = obj.Condition; }
    });
    const Filters = this.FiltersArray.filter(obj => obj.Active === true);

    const Data = {
      Skip_Count: this.SkipCount,
      Limit_Count: this.LimitCount,
      ShortKey: ShortOrderKey,
      ShortCondition: ShortOrderCondition,
      FilterQuery: Filters,
      User: this.UserInfo._id,
      CustomerId: this.CustomerDetails._id,
    };

    this.TableLoader();
    this.WalletService.All_Wallet_List(Data).subscribe(response => {
      this.PageLoader = false;
      this.SerialNoAddOn = this.SkipCount;
      if (response.Status && response.Status === true) {
        console.log(this.WalletDetails);
        this.WalletDetails = response.Response;
        setTimeout(() => {
          this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'display', 'none');
        }, 10);
        this.TotalRows = response.SubResponse;
        this.Pagination_Affect();
      } else if (!response.Status && response.ErrorCode === 400 || response.ErrorCode === 401 || response.ErrorCode === 417) {
        if (response.ErrorMessage === undefined || response.ErrorMessage === '' || response.ErrorMessage === null) {
          response.ErrorMessage = 'Some Error Occoured!, But not Identified.';
        }
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: response.ErrorMessage });
      } else {
        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Customer Records Getting Error!, But not Identify!' });
      }
    });
  }


  TableLoader() {
    setTimeout(() => {
      const Top = this.TableHeaderSection.nativeElement.offsetHeight - 2;
      const Height = this.TableBodySection.nativeElement.offsetHeight + 4;
      this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'display', 'flex');
      this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'height', Height + 'px');
      this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'line-height', Height + 'px');
      this.renderer.setStyle(this.TableLoaderSection.nativeElement, 'top', Top + 'px');
    }, 10);
  }

  Pagination_Affect() {
    const NoOfArrays = Math.ceil(this.TotalRows / this.LimitCount);
    const PrevClass = (this.CurrentIndex > 1 ? '' : 'PageAction_Disabled');
    this.PagePrevious = { Disabled: !(this.CurrentIndex > 1), Value: (this.CurrentIndex - 1), Class: PrevClass };
    const NextClass = (this.CurrentIndex < NoOfArrays ? '' : 'PageAction_Disabled');
    this.PageNext = { Disabled: !(this.CurrentIndex < NoOfArrays), Value: (this.CurrentIndex + 1), Class: NextClass };
    this.PagesArray = [];
    for (let index = 1; index <= NoOfArrays; index++) {
      if (index === 1) {
        this.PagesArray.push({ Text: '1', Class: 'Number', Value: 1, Show: true, Active: (this.CurrentIndex === index) });
      }
      if (index > 1 && NoOfArrays > 2 && index < NoOfArrays) {
        if (index === (this.CurrentIndex - 2)) {
          this.PagesArray.push({ Text: '...', Class: 'Dots', Show: true, Active: false });
        }
        if (index === (this.CurrentIndex - 1)) {
          this.PagesArray.push({ Text: (this.CurrentIndex - 1).toString(), Class: 'Number', Value: index, Show: true, Active: false });
        }
        if (index === this.CurrentIndex) {
          this.PagesArray.push({ Text: this.CurrentIndex.toString(), Class: 'Number', Value: index, Show: true, Active: true });
        }
        if (index === (this.CurrentIndex + 1)) {
          this.PagesArray.push({ Text: (this.CurrentIndex + 1).toString(), Class: 'Number', Value: index, Show: true, Active: false });
        }
        if (index === (this.CurrentIndex + 2)) {
          this.PagesArray.push({ Text: '...', Class: 'Dots', Show: true, Active: false });
        }
      }
      if (index === NoOfArrays && NoOfArrays > 1) {
        this.PagesArray.push({
          Text: NoOfArrays.toString(), Class: 'Number',
          Value: NoOfArrays, Show: true, Active: (this.CurrentIndex === index)
        });
      }
    }
    let ToCount = this.SkipCount + this.LimitCount;
    if (ToCount > this.TotalRows) { ToCount = this.TotalRows; }
    this.ShowingText = 'Showing <span>' + (this.SkipCount + 1) + '</span> to <span>' +
      ToCount + '</span> out of <span>' + this.TotalRows + '</span>  entries';
  }


 }



