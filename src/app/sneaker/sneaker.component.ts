import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SneakerService } from '../Shared/sneaker.service';
import { SnkimgService } from '../Shared/snkimg.service';
import { Sneaker } from '../Models/Sneaker';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';


class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-sneaker',
  templateUrl: './sneaker.component.html',
  styleUrls: ['./sneaker.component.css']
})

export class SneakerComponent implements OnInit {
  Title = "SneakerPage"

  constructor(private SneakerService: SneakerService, private SnkImgService: SnkimgService, http: HttpClient) {  
    http.get<Sneaker[]>('/sneaker').subscribe(result => {
      this.data = result;
    }, error => console.error(error));
  }

  data: any;
  snkrData: Sneaker;
  snkrList: Sneaker[];
  filename = "blank";
  imgData: any;
  imgListData: any;
  typeSelect: any;
  SneakerForm: FormGroup = new FormGroup({
    Brand: new FormControl("", [Validators.required]),
    Colorway1: new FormControl("", [Validators.required]),
    Colorway2: new FormControl(null),
    Model: new FormControl("", [Validators.required]),
    Name: new FormControl("", [Validators.required]),
    Type: new FormControl("", [Validators.required]),
    UPC: new FormControl("", [Validators.required]),
    DbImage: new FormControl(null),
  })
  uploadData: FormData = new FormData();
  submitted = false;
  readonly = true;
  isLoading = true;
  isImgLoading = true;
  EventValue: String = "Save";
  testtext: any;
  selectedFile!: ImageSnippet;


  ngOnInit() {
    this.isLoading = true; 
    this.getSneakers();
    //this.getImages();
    this.typeSelect = ["Baskball", "Casual", "Running", "Hiking"];
    this.uploadData = new FormData();
    this.SneakerForm = new FormGroup({
      Brand: new FormControl("", [Validators.required]),
      Colorway1: new FormControl("", [Validators.required]),
      Colorway2: new FormControl(null),
      Model: new FormControl("", [Validators.required]),
      Name: new FormControl("", [Validators.required]),
      Type: new FormControl("", [Validators.required]),
      UPC: new FormControl("", [Validators.required]),
      DbImage: new FormControl(null),
    })
  }

  /// Begin SneakerImgController Calls ///
  getImages() {
    this.SnkImgService.getAllImages().subscribe((data: any[]) => {
      this.imgListData = data;
      this.imgData = this.imgListData[0];
    })
  }

  getImg(id:string) {
    this.isImgLoading = true;
    this.SnkImgService.getImage(id).subscribe((data: any[]) => {
      this.isImgLoading = false;
      this.imgData = data[0];
    })
  }

  setFilename(files: FileList | null) {
    if (files == null) {
      this.filename = "";
      return;
    }
    if (files[0]) {
      this.filename = files[0].name as any;
    }
  }
 

  saveImg(files: FileList | null) {
    //const file: File | any = null;
    if (!files) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    let fileToUpload = <File>files[0];
    this.uploadData.append('file', fileToUpload, fileToUpload.name);
    console.log(JSON.stringify(this.uploadData));
    this.uploadData.forEach((value, key) => {
      console.log(key + " " + value)
    });

    this.SnkImgService
      .upload(this.uploadData)
      .subscribe((data: any) => {
        this.testtext = data;
      });
  }
  /// End SneakerImgController Calls ///


  /// Begin SneakerController Calls ///
  getSneakers() {
    this.SneakerService.getAll().subscribe((data: Sneaker[]) => {
      this.isLoading = false;
      this.snkrList = data;
    })
  }

  getSneaker(id: string) {
    this.SneakerService.get(id).subscribe((snkrData: Sneaker) => {
      this.data = snkrData;
    })
  }

  EditData(Data: Sneaker) {
    this.getImg(Data.dbImage);
    this.SneakerForm.controls["Brand"].setValue(Data.brand);
    this.SneakerForm.controls["Name"].setValue(Data.name);
    this.SneakerForm.controls["Colorway1"].setValue(Data.colorway1);
    this.SneakerForm.controls["Colorway2"].setValue(Data.colorway2);
    this.SneakerForm.controls["Model"].setValue(Data.model);
    this.SneakerForm.controls["Type"].setValue(Data.type);
    this.SneakerForm.controls["UPC"].setValue(Data.upc);
    this.getSneaker(Data.upc);
    this.EventValue = "Update";
    this.readonly = false;
  }

  Save() {
    if (this.SneakerForm.invalid) {
      return;
    }
    this.SneakerService.postData(this.SneakerForm.value).subscribe((data: boolean) => {
      this.submitted = data;
      this.resetForm();
    })
  }

  Delete(upc: string) {
    if (upc == null) {
      return;
    }
    this.SneakerService.deleteData(upc).subscribe((data: any) => {
      this.testtext = data;
      this.resetForm();
    })
  }

  deleteData(upc : string) {

  }

  Update() {
    this.submitted = true;
    if (this.SneakerForm.invalid) {
      return;
    }

    this.SneakerService.putData(this.SneakerForm.value.UPC, this.SneakerForm.value).subscribe((data: any) => {
      this.testtext = data;
      this.resetForm();
    })
  }

  resetForm() {
    this.getSneakers();
    this.SneakerForm.reset();
    this.clearImage();
    this.EventValue = "Save";
    this.submitted = false;
    this.readonly = true;
  }

  clearImage() {
    this.filename = "";
  }

  crtForm() {
    this.SneakerForm.reset();
    this.EventValue = "Save";
    this.submitted = false;
    this.readonly = false;
  }

  /// End SneakerController Calls ///

}
