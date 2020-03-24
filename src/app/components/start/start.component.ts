import { Component, OnInit } from '@angular/core';
import { Config } from '@app/shared/models/config';
import { InfoWrapper } from '@app/shared/models/infoWrapper';
import { Organisation } from '@app/shared/models/organisation';
import { ConfigService } from '@app/shared/services/config/config.service';
import { OrganisationService } from '@app/shared/services/organisation/organisation.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'fwas-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit {
  isLoading = true;
  config: Config;
  organisations: Array<Organisation>;

  constructor(
    private configService: ConfigService,
    private organisationService: OrganisationService
  ) {}

  ngOnInit() {
    const configObs = this.configService.readConfig();
    const organisationObs = this.organisationService.readAll();

    // run multiple observables in parallel
    forkJoin([configObs, organisationObs]).subscribe((results) => {
      this.config = results[0];
      this.organisations = (<InfoWrapper<Organisation>>results[1]).elements;
      this.isLoading = false;
    });
  }
}
