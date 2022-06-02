import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SneakerService } from '../Shared/sneaker.service';
import { SnkimgService } from '../Shared/snkimg.service';
import { UpcomingService } from '../Shared/upcoming.service';
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

  constructor(private SneakerService: SneakerService, private SnkImgService: SnkimgService, private UpcomingService: UpcomingService , http: HttpClient) {  
    http.get<Sneaker[]>('/sneaker').subscribe(result => {
      this.data = result;
    }, error => console.error(error));
  }

  data: any;
  snkrData: Sneaker;
  snkrList: Sneaker[];
  collectionList: Sneaker[];
  filename = "blank";
  imgData: any;
  imgListData: any;
  typeSelect: any;

  SneakerForm = new FormGroup({
    Brand: new FormControl("", [Validators.required]),
    Model: new FormControl("", [Validators.required]),
    Name: new FormControl("", [Validators.required]),
    Type: new FormControl("", [Validators.required]),
    ID: new FormControl(""),
    UPC: new FormControl(""),
    Colorway1: new FormControl(""),
    Colorway2: new FormControl(""),
    ReleaseDate: new FormControl(null),
    PurchDate: new FormControl(""),
    RetailPrice: new FormControl(0, [Validators.required]),
    ImgSrc: new FormControl(""),
    Link1: new FormControl(""),
    Raffle: new FormControl(false),
    Featured: new FormControl(false),
    IsNew: new FormControl(false),
    InCollection: new FormControl(false),
  });
  uploadData: FormData = new FormData();
  uploadImage: File;
  submitted = false; 
  readonly = true;
  newImage = false;
  isLoading = true;
  isImgLoading = true;
  EventValue: String = "Save";
  testtext: any;
  selectedFile!: ImageSnippet;


  ngOnInit() {
    this.isLoading = true; 
    this.getSneakers(); 
    this.typeSelect = ["Baskball", "Casual", "Running", "Hiking"];
    this.uploadData = new FormData();
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
    let oldName = this.SneakerForm.controls["DbImage"].value;
    if (files == null) {
      this.filename = "";
      return;
    }
    if (files[0]) {
      this.filename = files[0].name as any;
      this.newImage = true; 
      this.SneakerForm.controls["DbImage"].setValue(this.filename);
    }
  }

  setFile(event: Event | null) {
    if (event == null) return;
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      console.log("FileUpload -> files", fileList);  
      this.uploadImage = fileList[0];
      this.filename = this.uploadImage.name;
      this.SneakerForm.controls["ImgSrc"].setValue(fileList.item.name);
      this.newImage = true; 
    }
  } 

  saveImg(files: FileList | null) {
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

  saveImgFile(currFile: File | null) {
    if (!currFile) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(currFile);
    let fileToUpload = <File>currFile;
    this.uploadData.append('file', fileToUpload, fileToUpload.name);
    console.log(JSON.stringify(this.uploadData));
    this.uploadData.forEach((value, key) => {
      console.log(key + " " + value)
    });

    this.SnkImgService
      .uploadImage(this.uploadImage)
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
      this.collectionList =  [];
      data.forEach((value: Sneaker, index) => {
        if (value.inCollection == true)
          this.collectionList.push(value); //.splice(index, 1);
      })
    })
  }

  getSneaker(id: string) {
    this.SneakerService.get(id).subscribe((snkrData: Sneaker) => {
      this.snkrData = snkrData;
      this.imgData = this.snkrData.dbImageB64;
    }) 
  }
  getSneakerbyKey(pKey: string, rKey:string) {
    this.SneakerService.getByKey(pKey,rKey).subscribe((snkrData: Sneaker) => {
      this.snkrData = snkrData;
      this.imgData = this.snkrData.dbImageB64;
    })
  }

  SetForm(Data: Sneaker) {
    this.SneakerForm.controls["Brand"].setValue(Data.brand);
    this.SneakerForm.controls["Model"].setValue(Data.model);
    this.SneakerForm.controls["Name"].setValue(Data.name);
    this.SneakerForm.controls["Type"].setValue(Data.type);
    this.SneakerForm.controls["UPC"].setValue(Data.upc);
    if (Data.id == "")
      this.SneakerForm.controls["ID"].setValue(Data.upc);
    else
      this.SneakerForm.controls["ID"].setValue(Data.id);
    this.SneakerForm.controls["RetailPrice"].setValue(Data.retailPrice);
    this.SneakerForm.controls["Colorway1"].setValue(Data.colorway1);
    this.SneakerForm.controls["Colorway2"].setValue(Data.colorway2);
    this.SneakerForm.controls["ReleaseDate"].setValue(Data.releaseDate);
    this.SneakerForm.controls["PurchDate"].setValue(Data.purchDate);
    this.SneakerForm.controls["ImgSrc"].setValue(Data.imgSrc);
    this.SneakerForm.controls["Link1"].setValue(Data.link1);
    this.SneakerForm.controls["Raffle"].setValue(Data.raffle);
    this.SneakerForm.controls["Featured"].setValue(Data.featured);
    this.SneakerForm.controls["InCollection"].setValue(Data.inCollection);
  }

  EditData(Data: Sneaker) {
    this.SetForm(Data);
    this.imgData = Data.dbImageB64; 
    this.isImgLoading = false; 
    this.EventValue = "Update";
    this.readonly = false;
  } 

  Save() {
    if (this.SneakerForm.invalid) {
      return;
    }
    var pKey = this.SneakerForm.value.Brand;
    var rKey = this.SneakerForm.value.UPC;
    this.SneakerService.postData(this.SneakerForm.value).subscribe((data: boolean) => {
      this.submitted = data;
      this.resetForm();
    })
    // Sets snkrData
    this.getSneakerbyKey(pKey, rKey);
  }

  Delete(upc: string) {
    if (upc == null) {
      return;
    }
    this.SneakerService.deleteData(upc).subscribe((data: any) => {
      this.testtext = data;
      this.resetForm();
    })
    var snkr = new Sneaker;
    this.snkrList.forEach((value, index) => {
      if (value.upc == upc) snkr = this.snkrList[index];
    }) 
  }

  AddToCollectionUpdate() {
    // Gathers UPC for selected post and adds to sneaker collection
    // and updates current post to reflect it was added
    var pstID = this.SneakerForm.value.ID;
    var pstBrand = this.SneakerForm.value.Brand;
    var inColl = this.SneakerForm.value.InCollection;
    if (this.SneakerForm.value.ID != ""
      && this.SneakerForm.value.Brand != "") {
      this.SneakerForm.value.InCollection = ((inColl == false) ? true : false);
      this.Update();
    }
  }

  replaceUpdated(updated: Sneaker) {
    this.snkrList.forEach((value, index) => {
      if (value.id == updated.id) this.snkrList.splice(index, 1);
    })
    // Sets -> this.currPost
    this.getSneaker(updated.upc);
    this.snkrList.push(this.snkrData);
  }
   
  deleteData(upc : string) {

  }

  Update() {
    this.submitted = true;
    if (this.SneakerForm.invalid) {
      return;
    }

    if (this.newImage)
      this.saveImgFile(this.uploadImage);
    if (this.SneakerForm.value.IsNew == null)
      this.SneakerForm.value.IsNew = false;

    this.SneakerService.putData(this.SneakerForm.value.UPC, this.SneakerForm.value).subscribe((data: any) => {
      this.testtext = data;
      this.replaceUpdated(data);
      this.resetForm();
    })
  }

  UpdateWimage() {
    this.submitted = true;
    if (this.SneakerForm.invalid) {
      return;
    }

    if (this.newImage)
      this.saveImgFile(this.uploadImage);
    if (this.SneakerForm.value.IsNew == null)
      this.SneakerForm.value.IsNew = false;

    this.SneakerService.putData(this.SneakerForm.value.UPC, this.SneakerForm.value).subscribe((data: any) => {
      this.testtext = data;
      this.resetForm();
    })
  }


  resetForm() {
    //this.getSneakers();
    this.SneakerForm.reset();
    this.clearImage();
    this.EventValue = "Save";
    this.submitted = false;
    this.readonly = true;
    this.newImage = false;
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
