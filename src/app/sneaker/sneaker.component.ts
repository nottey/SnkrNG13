import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SneakerService } from '../Shared/sneaker.service';
import { SnkimgService } from '../Shared/snkimg.service';
import { UpcomingService } from '../Shared/upcoming.service';
import { Sneaker } from '../Models/Sneaker';
import { FormGroup, FormControl, Validators } from '@angular/forms';  


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
    /*http.get<Sneaker[]>('/sneaker').subscribe(result => {
      this.data = result;
    }, error => console.error(error));*/
  }

  data: any;
  snkrData: Sneaker;
  snkrList: Sneaker[];
  collectionList: Sneaker[];
  SnkrImgList: Sneaker[];
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
    this.getSneakerWImages(true);
    this.typeSelect = ["Baskball", "Casual", "Running", "Hiking"];
    this.uploadData = new FormData(); 

    environment

  }

  /// Begin SneakerImgController Calls ///
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
      var validFilename = !/[^a-z0-9_.@()-]/i.test(this.filename);
      //this.filename = this.filename.replace(/[/\\?%*:|"<>]/g, '-');
      this.SneakerForm.controls["ImgSrc"].setValue(this.filename);
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
    this.isLoading = true;
    this.SneakerService.getAll().subscribe((data: Sneaker[]) => {
      this.isLoading = false;
      this.snkrList = data;
      this.collectionList =  [];
      data.forEach((value: Sneaker, index) => {
        if (value.inCollection == true)
          this.collectionList.push(value); //.splice(index, 1);
      })
      this.isLoading = false;
    })
  }

  getSneakerWImages(getimages: boolean) { 
    this.SneakerService.getAllwImages(getimages).subscribe((data: Sneaker[]) => { 
      this.SnkrImgList = data; 
    })
  }

  getSneaker(id: string) {
    this.SneakerService.get(id).subscribe((snkrData: Sneaker) => {
      this.snkrData = snkrData;
      this.imgData = this.snkrData.dbImageB64;
    }) 
  }
  getSneakerbyKey(pKey: string, rKey: string) { 
    //this.SneakerService.getByKey(pKey,rKey).subscribe((snkrData: Sneaker) => {
    this.SneakerService.getSneaker(pKey, rKey,true).subscribe((snkrData: Sneaker) => {
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

  AddToCollection(sneaker: Sneaker) {
    // Gathers UPC for selected post and adds to sneaker collection
    // and updates current post to reflect it was added
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    this.SetForm(sneaker); 
    sneaker.purchDate = mm + '/' + dd + '/' + yyyy; 
    this.Update(); 
  }

  replaceUpdated(updated: Sneaker) {
    this.snkrList.forEach((value, index) => {
      if (value.id == updated.id) this.snkrList.splice(index, 1);
    })
    this.isLoading = true;
    // Sets -> this.currPost
    this.getSneaker(updated.upc);
    this.snkrList.push(this.snkrData);
    this.isLoading = false;
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
    this.getSneakers();
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
