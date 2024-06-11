import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './Authentication/auth.guard';
import { NotAuthGuard } from './Authentication/not-auth.guard';
import { CustomerRecordsComponent } from './components/customer-management/customer-records/customer-records.component';
import { UsersManagementComponent } from './components/users/users-management/users-management.component';
import { DeliveryRecordsComponent } from './components/delivery-management/delivery-records/delivery-records.component';
import { CustomerCreateComponent } from './components/customer-management/customer-create/customer-create.component';
import { CustomerViewComponent } from './components/customer-management/customer-view/customer-view.component';
import { DeliveryboyRecordsComponent } from './components/deliveryboy-management/deliveryboy-records/deliveryboy-records.component';
import { BannerRecordsComponent } from './components/banner-management/banner-records/banner-records.component';
import { CustomerFeedbackComponent } from './components/customer-management/customer-feedback/customer-feedback.component';
import { CustomerSupportsComponent } from './components/customer-management/customer-supports/customer-supports.component';
import { OrderRecordsComponent } from './components/order-management/order-records/order-records.component';
import { PurchaseRecordsComponent } from './components/order-management/purchase-records/purchase-records.component';
import { VilfreshBasketGenerateComponent } from './components/vilfresh-basket-management/vilfresh-basket-generate/vilfresh-basket-generate.component';
import { CurrentOrderRecordsComponent } from './components/order-management/current-order-records/current-order-records.component';
import { PaymentHistoryComponent } from './components/payment-history/payment-history.component';
import { ProductConfigurationRecordsComponent } from './components/vilfresh-basket-management/product-configuration-records/product-configuration-records.component';
import { CustomerAnalyticsComponent } from './components/customer-management/customer-analytics/customer-analytics.component';
import { DailyCollectionsComponent } from './components/deliveryboy-management/daily-collections/daily-collections.component';
import { DeliveryboyTrackingComponent } from './components/deliveryboy-management/deliveryboy-tracking/deliveryboy-tracking.component';
import { DeliveryboyAttendanceComponent } from './components/deliveryboy-management/deliveryboy-attendance/deliveryboy-attendance.component';
import { CustomerReferralComponent } from './components/customer-management/customer-referral/customer-referral.component';
import { CustomerSupportTitleComponent } from './components/customer-management/customer-support-title/customer-support-title.component';
import { OrderProductsComponent } from './components/order-management/order-products/order-products.component';
import { PaymentDetailedViewComponent } from './components/payment-history/payment-detailed-view/payment-detailed-view.component';
import { NotificationManagementComponent } from './components/notification-management/notification-management.component';


const routes: Routes = [
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full',
      data: {}
    },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [NotAuthGuard],
        data: {}
      },
      {
        path: 'customer-management/customer-create',
        component: CustomerCreateComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'customer-management/customer-records',
        component: CustomerRecordsComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'customer-management/customer-edit/:id',
        component: CustomerCreateComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'customer-management/customer-feedback',
        component: CustomerFeedbackComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'customer-management/customer-support',
        component: CustomerSupportsComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'customer-management/customer-view/:id',
        component: CustomerViewComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'delivery-management/delivery-records',
        component: DeliveryRecordsComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'delivery-management/delivery-records',
        component: DeliveryRecordsComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'delivery-management/delivery-boy-records',
        component: DeliveryboyRecordsComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'Deliveryboy-Tracking',
        component: DeliveryboyTrackingComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'customer-management/SupportTitle-Records',
        component: CustomerSupportTitleComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'banner-management/banner-records',
        component: BannerRecordsComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'users/users-management',
        component: UsersManagementComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'order-management/order-records',
        component: OrderRecordsComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
         path: 'order-management/order-products',
         component: OrderProductsComponent,
         canActivate: [AuthGuard],
         data: {}
       },
      {
        path: 'order-management/Current-Orders',
        component: CurrentOrderRecordsComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'order-management/purchase-records',
        component: PurchaseRecordsComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'payment-management/payment-records',
        component: PaymentHistoryComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'payment-history/payment-detailed-view/:id',
        component: PaymentDetailedViewComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'Daily-CollectionAmount',
        component: DailyCollectionsComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
         path: 'Vilfresh-Basket',
         component: VilfreshBasketGenerateComponent,
         canActivate: [AuthGuard],
         data: {}
      },
      // Notification Management
      {
        path: 'notification-Management/notification-records',
        component: NotificationManagementComponent,
        canActivate: [AuthGuard],
        data: {}
     },
      {
        path: 'Product-Configuration',
        component: ProductConfigurationRecordsComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'Customer-Analytics',
        component: CustomerAnalyticsComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
        path: 'Deliveryboy-Attendance',
        component: DeliveryboyAttendanceComponent,
        canActivate: [AuthGuard],
        data: {}
      },
      {
         path: 'Customer-Referrals',
         component: CustomerReferralComponent,
         canActivate: [AuthGuard],
         data: {}
       },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
