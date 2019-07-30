import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
  } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective
  } from '@angular/forms';
import { Image } from '@app/shared/models/image';

@Component({
  selector: 'fwas-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class FileUploadComponent implements OnInit, OnChanges {

  @Input() image: Image;
  @Input() groupName: string;
  @Input() mandatory = false;

  private fileReader = new FileReader();
  fileToUpload: File;

  constructor(private _fb: FormBuilder, private parent: FormGroupDirective) {
  }

  ngOnInit() {
    this.createForm();

    this.fileReader.onload = (file) => {
      this.image.data = <string>this.fileReader.result;
      this.parent.form.controls[this.groupName].setValue(this.image);
    };
  }

  ngOnChanges() {
    this.createForm();
  }

  private createForm() {
    if (!this.image) {
      this.image = new Image();
      this.image.imageUrl = '';
    }

    const imageControl = this._fb.group({
      data: [this.image.data],
      filename: [this.image.filename],
      imageUrl: [this.image.imageUrl]
    });

    this.parent.form.addControl(this.groupName, imageControl);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.image.filename = this.fileToUpload.name;
    this.fileReader.readAsDataURL(this.fileToUpload);
  }

}
