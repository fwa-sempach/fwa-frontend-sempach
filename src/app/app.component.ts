import { Component } from "@angular/core";
import { NgSelectConfig } from "@ng-select/ng-select";

@Component({
  selector: "fwas-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(private config: NgSelectConfig) {
    this.config.notFoundText = "Das konnte nicht gefunden werden...";
    this.config.addTagText = "Element hinzufügen";
  }
}
