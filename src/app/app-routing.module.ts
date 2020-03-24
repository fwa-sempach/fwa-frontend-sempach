import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdDetailComponent } from '@app/components/ad-detail/ad-detail.component';
import { AdComponent } from '@app/components/ad/ad.component';
import { AdminComponent } from '@app/components/admin/admin/admin.component';
import { AuthComponent } from '@app/components/auth/auth.component';
import { DocumentsComponent } from '@app/components/documents/documents.component';
import { CreateOrganisationComponent } from '@app/components/manage/create-organisation/create-organisation.component';
import { ManageOrganisationComponent } from '@app/components/manage/manage-organisation/manage-organisation.component';
import { OfferDetailComponent } from '@app/components/offer-detail/offer-detail.component';
import { OfferComponent } from '@app/components/offer/offer.component';
import { OrganisationDetailComponent } from '@app/components/organisation-detail/organisation-detail.component';
import { OrganisationsComponent } from '@app/components/organisations/organisations.component';
import { RegisterComponent } from '@app/components/register/register.component';
import { StartComponent } from '@app/components/start/start.component';
import { AdminGuard } from '@app/shared/guards/admin/admin.guard';
import { NewOrganisationGuard } from '@app/shared/guards/new-organisation/new-organisation.guard';
import { OrganisationGuard } from '@app/shared/guards/organisation/organisation.guard';

import { ImprintComponent } from './components/imprint/imprint.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'start', component: StartComponent },
  { path: 'organisationen', component: OrganisationsComponent },
  { path: 'angebote', component: OfferComponent },
  { path: 'angebote/:id', component: OfferDetailComponent },
  { path: 'inserate', component: AdComponent },
  { path: 'inserate/:id', component: AdDetailComponent },
  { path: 'login', component: AuthComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: RecoverPasswordComponent },
  { path: 'organisationen/:id', component: OrganisationDetailComponent },
  { path: 'dokumente', component: DocumentsComponent },
  { path: 'impressum', component: ImprintComponent },

  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },

  {
    path: 'manage',
    children: [
      {
        path: 'organisationen',
        component: CreateOrganisationComponent,
        canActivate: [NewOrganisationGuard],
      },
      {
        path: 'organisationen/:id',
        component: ManageOrganisationComponent,
        canActivate: [OrganisationGuard],
      },
      // { path: 'offer/:id', component: ManageOfferComponent, canActivate: [OrganisationGuard] }
    ],
  },

  { path: '', redirectTo: '/start', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
