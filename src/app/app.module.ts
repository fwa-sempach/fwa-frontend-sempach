import {
  HashLocationStrategy,
  LocationStrategy,
  registerLocaleData,
} from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeDeCh from '@angular/common/locales/de-CH';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from '@app/app.component';
import { AdComponent } from '@app/components/ad/ad.component';
import { AuthComponent } from '@app/components/auth/auth.component';
import { OfferComponent } from '@app/components/offer/offer.component';
import { StartComponent } from '@app/components/start/start.component';
import { NavigationComponent } from '@app/shared/components/navigation/navigation.component';
import { AdminGuard } from '@app/shared/guards/admin/admin.guard';
import { NewOrganisationGuard } from '@app/shared/guards/new-organisation/new-organisation.guard';
import { OrganisationGuard } from '@app/shared/guards/organisation/organisation.guard';
import { AdService } from '@app/shared/services/ad/ad.service';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { TokenInterceptor } from '@app/shared/services/auth/token.interceptor';
import { CategoryService } from '@app/shared/services/category/category.service';
import { ConfigService } from '@app/shared/services/config/config.service';
import { DocumentService } from '@app/shared/services/document/document.service';
import { OfferService } from '@app/shared/services/offer/offer.service';
import { OrganisationService } from '@app/shared/services/organisation/organisation.service';
import { ParticipantService } from '@app/shared/services/participant/participant.service';
import { UserService } from '@app/shared/services/user/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fal } from '@fortawesome/pro-light-svg-icons';
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxCaptchaModule } from 'ngx-captcha';
import { QuillModule } from 'ngx-quill';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AdDetailComponent } from './components/ad-detail/ad-detail.component';
import { AdminComponent } from './components/admin/admin/admin.component';
import { CandidatureComponent } from './components/candidature/candidature.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { CreateOrganisationComponent } from './components/manage/create-organisation/create-organisation.component';
import { ManageOrganisationComponent } from './components/manage/manage-organisation/manage-organisation.component';
import { OfferDetailComponent } from './components/offer-detail/offer-detail.component';
import { OrganisationDetailComponent } from './components/organisation-detail/organisation-detail.component';
import { OrganisationsComponent } from './components/organisations/organisations.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { RegisterComponent } from './components/register/register.component';
import { ManagePersonComponent } from './shared/components/admin/manage-person/manage-person.component';
import { FieldErrorDisplayComponent } from './shared/components/field-error-display/field-error-display.component';
import { FileUploadComponent } from './shared/components/file-upload/file-upload.component';
import { ManageAdComponent } from './shared/components/manage/manage-ad/manage-ad.component';
import { ManageOfferComponent } from './shared/components/manage/manage-offer/manage-offer.component';
import { ManageOrganisationInfoComponent } from './shared/components/manage/manage-organisation-info/manage-organisation-info.component';
import { ManageParticipantComponent } from './shared/components/manage/manage-participant/manage-participant.component';
import { ManageUserInfoComponent } from './shared/components/manage/manage-user-info/manage-user-info.component';
import { OrganisationHeaderComponent } from './shared/components/organisation-header/organisation-header.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { PageNotWorkingComponent } from './shared/components/page-not-working/page-not-working.component';
import { StripHtmlPipe } from './shared/pipes/strip-html.pipe';
import { NgbDateChParserFormatter } from './shared/providers/ngb-date-ch-parser-formatter';
import { FormService } from './shared/services/form/form.service';

// Font Awesome Icons
library.add(fal);

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    StartComponent,
    OfferComponent,
    AdComponent,
    AuthComponent,
    OfferDetailComponent,
    OrganisationHeaderComponent,
    DocumentsComponent,
    AdDetailComponent,
    CandidatureComponent,
    FileUploadComponent,
    FieldErrorDisplayComponent,
    OrganisationDetailComponent,
    PageNotFoundComponent,
    ManageOrganisationComponent,
    ManageOfferComponent,
    ManagePersonComponent,
    OrganisationsComponent,
    RegisterComponent,
    AdminComponent,
    CreateOrganisationComponent,
    ManageOrganisationInfoComponent,
    ManageAdComponent,
    ImprintComponent,
    ManageParticipantComponent,
    ManageUserInfoComponent,
    PageNotWorkingComponent,
    StripHtmlPipe,
    RecoverPasswordComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxDatatableModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      autoDismiss: true,
    }),
    NgbModule,
    NgxCaptchaModule,
    FontAwesomeModule,
    QuillModule.forRoot(),
  ],
  providers: [
    CategoryService,
    OfferService,
    AuthService,
    OrganisationService,
    ConfigService,
    AdService,
    ParticipantService,
    DocumentService,
    UserService,
    FormService,
    OrganisationGuard,
    NewOrganisationGuard,
    AdminGuard,
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: NgbDateChParserFormatter },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'de-CH' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

registerLocaleData(localeDeCh, 'de-CH');
