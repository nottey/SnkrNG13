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

  constructor(private SneakerService: SneakerService, private SnkImgService: SnkimgService, private UpcomingService: UpcomingService, http: HttpClient) {
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
  tableType: String = "Base";

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
    this.tableType = "Base";
    this.getSneakers();
    this.getSneakerWImages(true);
    this.typeSelect = ["Baskball", "Casual", "Running", "Hiking"];
    this.uploadData = new FormData(); 
  }

  //#region Image Calls  
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
  //#endregion 


  //#region Sneaker Service Calls
  getSneakers() {
    this.isLoading = true;
    this.SneakerService.getAll().subscribe((data: Sneaker[]) => {
      this.isLoading = false;
      this.snkrList = data;
      this.collectionList = [];
      data.forEach((value: Sneaker, index) => {
        if (value.inCollection == true)
          this.collectionList.push(value); //.splice(index, 1);
      })
      this.isLoading = false;
    })
  }

  getSneakerWImages(getimages: boolean) {
    this.isImgLoading = true;
    this.SneakerService.getAllwImages(getimages).subscribe((data: Sneaker[]) => {
      this.SnkrImgList = data;
      this.isImgLoading = false;
    })
  }

  getSneaker(id: string) {
    this.SneakerService.get(id).subscribe((snkrData: Sneaker) => {
      this.snkrData = snkrData;
      this.imgData = this.snkrData.dbImageB64;
    })
  }

  getSneakerbyKey(pKey: string, rKey: string) {
    this.SneakerService.getSneaker(pKey, rKey, true).subscribe((snkrData: Sneaker) => {
      this.snkrData = snkrData;
      this.imgData = this.snkrData.dbImageB64;
    })
  }

  Save() {
    if (this.SneakerForm.invalid) {
      return;
    }

    if (this.newImage)
      this.saveImgFile(this.uploadImage);
    this.FixBools();
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

    sneaker.purchDate = mm + '/' + dd + '/' + yyyy;
    this.SetForm(sneaker);
    this.Update();
  }

  Update() {
    this.submitted = true;
    if (this.SneakerForm.invalid) {
      return;
    }
    this.FixBools();
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
    this.FixBools();
    if (this.newImage)
      this.saveImgFile(this.uploadImage);

    this.SneakerService.putData(this.SneakerForm.value.UPC, this.SneakerForm.value).subscribe((data: any) => {
      this.testtext = data;
      this.resetForm();
    })
  }
//#endregion

//#region Form Tasks
  crtForm() {
    this.SneakerForm.reset();
    this.EventValue = "Save";
    this.submitted = false;
    this.readonly = false;
  }

  resetForm() {
    this.getSneakers();
    this.SneakerForm.reset();
    this.filename = "";
    this.EventValue = "Save";
    this.submitted = false;
    this.readonly = true;
    this.newImage = false;
  }

  SetForm(Data: Sneaker) {
    // Sets Sneaker form from input data
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

  findSneakersWithImages(sneakers: Sneaker[]): any[] { 
    const arr = sneakers || [];
    const result = arr.filter(s => s.dbImageB64 != "");
    return result;  
  }

  chgTableType(type: string) {
    this.tableType = type;
  }

  EditData(Data: Sneaker) {
    //Called when 'Edit' button is selected from table
    this.SetForm(Data);
    console.log(Data.id);
    var b64data = this.SnkrImgList.find(selected => selected.id == Data.id);
    if (b64data) { this.imgData = b64data.dbImageB64 } 
    this.isImgLoading = false;
    this.EventValue = "Update";
    this.readonly = false;
  }

  FixBools() { 
    this.SneakerForm.controls["IsNew"].setValue(this.SneakerForm.value.IsNew === 'true' ? true : false);
    this.SneakerForm.controls["Raffle"].setValue(this.SneakerForm.value.Raffle === 'true' ? true : false);
    this.SneakerForm.controls["Featured"].setValue(this.SneakerForm.value.Featured === 'true' ? true : false);
    this.SneakerForm.controls["InCollection"].setValue(this.SneakerForm.value.InCollection === 'true' ? true : false);
    //if (this.SneakerForm.value.PurchDate == null)
    //  console.log(this.SneakerForm.value.PurchDate);
    //this.SneakerForm.controls["PurchDate"].setValue(this.SneakerForm.value.PurchDate === '' ? '' : this.SneakerForm.value.PurchDate);
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
  //#endregion

 



  /// End SneakerController Calls ///

}
