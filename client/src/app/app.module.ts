import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
// import { CustomerRegisterComponent } from './components/customers/customer-register/customer-register.component';
// import { CustomerRecordsComponent } from './components/customers/customer-records/customer-records.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatCheckboxModule,
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
  MatSnackBarModule,
  MatMenuModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTabsModule,
  MatToolbarModule,
  MatSidenavModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatButtonToggleModule,
  // MatTimepickerModule


} from '@angular/material';
// import { MatTimepickerModule } from '@angular/material/timepicker';
import { CustomerRecordsComponent } from './components/customer-management/customer-records/customer-records.component';
import { CustomerCreateComponent } from './components/customer-management/customer-create/customer-create.component';
import { DeliveryRecordsComponent } from './components/delivery-management/delivery-records/delivery-records.component';
import { UsersManagementComponent } from './components/users/users-management/users-management.component';
import { MyInterceptor } from './Authentication/my-interceptor';
import { ModalSessionExpiredComponent } from './components/Modals/modal-session-expired/modal-session-expired.component';
import { ModalUserViewComponent } from './components/Modals/modal-user-view/modal-user-view.component';
import { ModalModule, ButtonsModule } from 'ngx-bootstrap';
import { ModalCustomerManagementComponent } from './components/Modals/modal-customer-management/modal-customer-management.component';
import { ModalCustomerViewComponent } from './components/Modals/modal-customer-view/modal-customer-view.component';
import { ModalUserManagementComponent } from './components/Modals/modal-user-management/modal-user-management.component';
import { ModalApprovedComponent } from './components/Modals/modal-approved/modal-approved.component';
import { ModalDeliverylineManagementComponent } from './components/Modals/modal-deliveryline-management/modal-deliveryline-management.component';
import { ModalDeliverylineViewComponent } from './components/Modals/modal-deliveryline-view/modal-deliveryline-view.component';
import { ModalDeleteComponent } from './components/Modals/modal-delete/modal-delete.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { CustomerViewComponent } from './components/customer-management/customer-view/customer-view.component';
import { DeliveryApprovedComponent } from './components/Modals/delivery-approved/delivery-approved.component';
import { ModalDeliverypersonManagementComponent } from './components/Modals/modal-deliveryperson-management/modal-deliveryperson-management.component';
import { DeliveryboyRecordsComponent } from './components/deliveryboy-management/deliveryboy-records/deliveryboy-records.component';
import { ModalAlertComponent } from './components/Modals/modal-alert/modal-alert.component';
import { OrderRecordsComponent } from './components/order-management/order-records/order-records.component';
import { OrderHistoryComponent } from './components/order-management/order-history/order-history.component';
import { BannerRecordsComponent } from './components/banner-management/banner-records/banner-records.component';
import { ModalBannerManagementComponent } from './components/Modals/modal-banner-management/modal-banner-management.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { BannerApprovedComponent } from './components/Modals/banner-approved/banner-approved.component';
import { CustomerFeedbackComponent } from './components/customer-management/customer-feedback/customer-feedback.component';
import { CustomerSupportsComponent } from './components/customer-management/customer-supports/customer-supports.component';
import { ModalCustomerSupportComponent } from './components/Modals/modal-customer-support/modal-customer-support.component';
import { ModalUpcomingorderViewComponent } from './components/Modals/modal-upcomingorder-view/modal-upcomingorder-view.component';
import { PurchaseRecordsComponent } from './components/order-management/purchase-records/purchase-records.component';
import { ModalPurchaseViewComponent } from './components/Modals/modal-purchase-view/modal-purchase-view.component';
import { VilfreshBasketGenerateComponent } from './components/vilfresh-basket-management/vilfresh-basket-generate/vilfresh-basket-generate.component';
import { CurrentOrderRecordsComponent } from './components/order-management/current-order-records/current-order-records.component';
import { ModalCurrentorderViewComponent } from './components/Modals/modal-currentorder-view/modal-currentorder-view.component';
import { ModalBasketViewComponent } from './components/Modals/modal-basket-view/modal-basket-view.component';
import { ModalCustomerFeedbackComponent } from './components/Modals/modal-customer-feedback/modal-customer-feedback.component';
import { ModalCreditManagementComponent } from './components/Modals/Modal-CreditHistory/modal-credit-management/modal-credit-management.component';
import { ModalCreditManagementViewComponent } from './components/Modals/Modal-CreditHistory/modal-credit-management-view/modal-credit-management-view.component';
import { PaymentHistoryComponent } from './components/payment-history/payment-history.component';
import { PaymentDetailedViewComponent } from './components/payment-history/payment-detailed-view/payment-detailed-view.component';
import { WalletRecordsComponent } from './components/Modals/Modal-WalletHistory/wallet-records/wallet-records.component';
import {ModalWalletManagementComponent} from './components/Modals/Modal-WalletHistory/modal-wallet-management/modal-wallet-management.component';
import { ProductConfigurationRecordsComponent } from './components/vilfresh-basket-management/product-configuration-records/product-configuration-records.component';
import { ModalProductConfigurationComponent } from './components/Modals/modal-product-configuration/modal-product-configuration.component';
import { ModalConfigViewComponent } from './components/Modals/modal-config-view/modal-config-view.component';
import { ModalPurchaseAlertComponent } from './components/Modals/modal-purchase-alert/modal-purchase-alert.component';
import { CustomerAnalyticsComponent } from './components/customer-management/customer-analytics/customer-analytics.component';
import { ModalCustomerAnalyticsComponent } from './components/Modals/modal-customer-analytics/modal-customer-analytics.component';
import { DailyCollectionsComponent } from './components/deliveryboy-management/daily-collections/daily-collections.component';
import { ModalCollectionApproveComponent } from './components/Modals/modal-collection-approve/modal-collection-approve.component';
import { ModalCollectionComponent } from './components/Modals/modal-collection/modal-collection.component';
import { DeliveryboyTrackingComponent } from './components/deliveryboy-management/deliveryboy-tracking/deliveryboy-tracking.component';
import { DeliveryboyAttendanceComponent } from './components/deliveryboy-management/deliveryboy-attendance/deliveryboy-attendance.component';
import { ModalAttendanceComponent } from './components/Modals/modal-attendance/modal-attendance.component';
import { ModalAttendanceViewComponent } from './components/Modals/modal-attendance-view/modal-attendance-view.component';
import { CustomerReferralComponent } from './components/customer-management/customer-referral/customer-referral.component';
import { ModalCustomerReferralComponent } from './components/Modals/modal-customer-referral/modal-customer-referral.component';
import { ModalSupporttitleManagementComponent } from './components/Modals/modal-supporttitle-management/modal-supporttitle-management.component';
import { CustomerSupportTitleComponent } from './components/customer-management/customer-support-title/customer-support-title.component';
import { ModalExtraProductConfigurationComponent } from './components/Modals/modal-extra-product-configuration/modal-extra-product-configuration.component';
import { OrderProductsComponent } from './components/order-management/order-products/order-products.component';
import { NotificationManagementComponent } from './components/notification-management/notification-management.component';
// import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CustomerRecordsComponent,
    CustomerCreateComponent,
    DeliveryRecordsComponent,
    UsersManagementComponent,
    ModalSessionExpiredComponent,
    ModalUserViewComponent,
    ModalCustomerManagementComponent,
    ModalCustomerViewComponent,
    ModalUserManagementComponent,
    ModalApprovedComponent,
    ModalDeliverylineManagementComponent,
    ModalDeliverylineViewComponent,
    ModalDeleteComponent,
    CustomerViewComponent,
    DeliveryboyRecordsComponent,
    DeliveryApprovedComponent,
    ModalDeliverypersonManagementComponent,
    ModalAlertComponent,
    OrderRecordsComponent,
    OrderHistoryComponent,
    BannerRecordsComponent,
    ModalBannerManagementComponent,
    BannerApprovedComponent,
    CustomerFeedbackComponent,
    CustomerSupportsComponent,
    ModalCustomerSupportComponent,
    ModalUpcomingorderViewComponent,
    WalletRecordsComponent,
    ModalWalletManagementComponent,
    PurchaseRecordsComponent,
    ModalPurchaseViewComponent,
    VilfreshBasketGenerateComponent,
    CurrentOrderRecordsComponent,
    ModalCurrentorderViewComponent,
    ModalBasketViewComponent,
    ModalCustomerFeedbackComponent,
    ModalCreditManagementComponent,
    ModalCreditManagementViewComponent,
    PaymentHistoryComponent,
    PaymentDetailedViewComponent,
    ProductConfigurationRecordsComponent,
    ModalProductConfigurationComponent,
    ModalConfigViewComponent,
    ModalPurchaseAlertComponent,
    CustomerAnalyticsComponent,
    ModalCustomerAnalyticsComponent,
    DailyCollectionsComponent,
    ModalCollectionApproveComponent,
    ModalCollectionComponent,
    DeliveryboyTrackingComponent,
    DeliveryboyAttendanceComponent,
    ModalAttendanceComponent,
    ModalAttendanceViewComponent,
    CustomerReferralComponent,
    ModalCustomerReferralComponent,
    ModalSupporttitleManagementComponent,
    CustomerSupportTitleComponent,
    ModalExtraProductConfigurationComponent,
    OrderProductsComponent,
    NotificationManagementComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTooltipModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatRadioModule,
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyBM6zu-n9zRCwisWLkK0SCRr-f3uNxBJ6U', libraries: ['places', 'geocoder'] }),
    AgmDirectionModule,
    ImageCropperModule,
    MatButtonToggleModule,
    // NgxMaterialTimepickerModule
  


  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true }],
  entryComponents: [
    ModalSessionExpiredComponent,
    ModalUserViewComponent,
    ModalCustomerViewComponent,
    ModalUserManagementComponent,
    ModalApprovedComponent,
    ModalCustomerManagementComponent,
    ModalDeliverylineViewComponent,
    ModalDeliverylineManagementComponent,
    ModalDeleteComponent,
    DeliveryApprovedComponent,
    ModalDeliverypersonManagementComponent,
    ModalAlertComponent,
    ModalBannerManagementComponent,
    BannerApprovedComponent,
    ModalCustomerSupportComponent,
    ModalUpcomingorderViewComponent,
    ModalWalletManagementComponent,
    ModalPurchaseViewComponent,
    ModalCurrentorderViewComponent,
    ModalBasketViewComponent,
    ModalCustomerFeedbackComponent,
    ModalCreditManagementComponent,
    ModalCreditManagementViewComponent,
    WalletRecordsComponent,
    ModalProductConfigurationComponent,
    ModalConfigViewComponent,
    ModalPurchaseAlertComponent,
    ModalCustomerAnalyticsComponent,
    ModalCollectionApproveComponent,
    ModalCollectionComponent,
    ModalAttendanceComponent,
    ModalAttendanceViewComponent,
    ModalCustomerReferralComponent,
    ModalSupporttitleManagementComponent,
    ModalExtraProductConfigurationComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
