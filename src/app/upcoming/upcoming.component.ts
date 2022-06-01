import { Component, OnInit } from '@angular/core';
import { UpcomingService } from '../Shared/upcoming.service';
import { SnkimgService } from '../Shared/snkimg.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { upcomingPost } from '../Models/upcomingPost'; 

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.css']
})
export class UpcomingComponent implements OnInit {
  Title = "Sneaker Calendar"

  constructor(private UpcomingService: UpcomingService, private SnkImgService: SnkimgService) { }
  data: any;
  allPosts: upcomingPost[];
  currPost: upcomingPost;
  submitted = false;
  readonly = true;
  isLoading = true;
  EventValue: any = "Save";
  prevView: any;
  currView: any; 

  ReleaseForm = new FormGroup({
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
  filename = '';
  testtext: any;
  postImg: any;
  imgData: string;
  imgListData: any;
  isImgLoading = true;
  newImage = false;
  selectedFile: ImageSnippet;


  ngOnInit(): void {
    this.getPosts(); 
  }

  /////////////////////////
  /*   
   *  
   *
   *
   *
   */



  /// Begin SneakerImgController Calls ///
  getImg(id: string) {
    /* Get image from selected Post
     */
    this.isImgLoading = true;
    this.SnkImgService.getImage(id).subscribe((data: any[]) => {
      this.isImgLoading = false;
      this.postImg = data[0];
    })
  }

  setFile(event: Event | null) {
    if (event == null) return;
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      console.log("FileUpload -> files", fileList); 
      this.uploadImage = fileList[0];
      this.filename = this.uploadImage.name;
      this.ReleaseForm.controls["ImgSrc"].setValue(this.filename);
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

    /*this.SnkImgService
      .upload(this.uploadData)
      .subscribe((data: any) => {
        this.testtext = data;
      });*/
  }
  /// End SneakerImgController Calls ///

  getPosts() {
    //Create a static/old version that while the background loads, old data is displayed
    //??determine how long this takes to repopulate/ remove updated item until return from call
    this.UpcomingService.getAll().subscribe((postData: upcomingPost[]) => {
      this.isLoading = false; 
      this.allPosts = postData;
      this.postImg = postData[0].dbImageB64;
      this.imgData = postData[0].dbImageB64;
    })
  }

  getUpcomingPost(brand: string, id: string) {
    /*Used to get new/updated post while keeping untouched records*/
    this.UpcomingService.get(brand,id).subscribe((data: any) => {
      this.currPost = data; 
    })
  }

  EditData(Data: any) {
    /*Load data into Release Form*/

    this.SetForm(Data); 
    this.imgData = Data.dbImageB64;
    this.currPost = Data;
    this.EventValue = "Update"; 
    this.readonly = false;
  }

  SetForm(Data: upcomingPost) {
    this.ReleaseForm.controls["Brand"].setValue(Data.brand);
    this.ReleaseForm.controls["Model"].setValue(Data.model);
    this.ReleaseForm.controls["Name"].setValue(Data.name);
    this.ReleaseForm.controls["Type"].setValue(Data.type);
    this.ReleaseForm.controls["ID"].setValue(Data.id);
    this.ReleaseForm.controls["UPC"].setValue(Data.upc);
    this.ReleaseForm.controls["RetailPrice"].setValue(Data.retailPrice);
    this.ReleaseForm.controls["Colorway1"].setValue(Data.colorway1);
    this.ReleaseForm.controls["Colorway2"].setValue(Data.colorway2);
    this.ReleaseForm.controls["ReleaseDate"].setValue(Data.releaseDate);
    this.ReleaseForm.controls["PurchDate"].setValue(Data.purchDate);
    this.ReleaseForm.controls["ImgSrc"].setValue(Data.imgSrc);
    this.ReleaseForm.controls["Link1"].setValue(Data.link1);
    this.ReleaseForm.controls["Raffle"].setValue(Data.raffle);
    this.ReleaseForm.controls["Featured"].setValue(Data.featured);
    this.ReleaseForm.controls["InCollection"].setValue(Data.inCollection);
  }

  Save() { 
    let isValid = this.ReleaseForm.invalid;
    this.ReleaseForm.patchValue({
      UPC: this.ReleaseForm.value.ID,
      Colorway1: "",
      Colorway2: "",
      Featured: false,
      Raffle: false,
      IsNew: false
    });
    this.UpcomingService.postData(this.ReleaseForm.value).subscribe((data: any) => {
      this.data = data;
      this.resetForm();
    })
    
    this.uploadData = this.ReleaseForm.value;
    // Sets -> this.currPost
    this.getUpcomingPost(this.ReleaseForm.value.Brand, this.ReleaseForm.value.ID);
    //this.resetForm();
  }

  Update() {
    this.submitted = true;
    if (this.ReleaseForm.invalid) {
      return;
    }
    if(this.newImage)
      this.saveImgFile(this.uploadImage);
    if (this.ReleaseForm.value.IsNew == null) 
      this.ReleaseForm.value.IsNew = false;
    
    this.UpcomingService.putData(this.ReleaseForm.value.ID, this.ReleaseForm.value).subscribe((data: any) => {
      this.data = data;
      this.replaceUpdated(this.currPost);
      this.resetForm();
    })
  }

  AddToCollectionUpdate() {
    // Gathers UPC for selected post and adds to sneaker collection
    // and updates current post to reflect it was added
    var pstID = this.ReleaseForm.value.ID;
    var pstBrand = this.ReleaseForm.value.Brand;
    if (this.ReleaseForm.value.ID != ""
      && this.ReleaseForm.value.Brand != ""
      && this.ReleaseForm.value.InCollection == false) {  
        this.ReleaseForm.value.InCollection = true;
        //this.Update();

    }
  }

  AddToCollection(Data: upcomingPost) {
    // Gathers UPC for selected post and adds to sneaker collection
    // and updates current post to reflect it was added
    var pstID = Data.id;
    var pstBrand = Data.brand;
    if (Data.id != "" && Data.brand != "" && Data.inCollection == false) {
      Data.inCollection = true;
      this.SetForm(Data);
      this.Update();
    }
  }

  Delete(Data: any) {
    if (Data.id == null) {
      return;
    }
    this.UpcomingService.deleteData(Data.brand, Data.id).subscribe((data: any) => {
      this.data = data;
      this.resetForm();
    })
  }

  replaceUpdated(updated: upcomingPost) {
    this.allPosts.forEach((value, index) => {
      if (value.id == updated.id) this.allPosts.splice(index, 1);
    })
    // Sets -> this.currPost
    this.getUpcomingPost(updated.brand, updated.id);
    this.allPosts.push( this.currPost);
  }

  resetForm() {
    //this.getPosts();
    this.ReleaseForm.reset();
    this.clearImage();
    this.EventValue = "Save";
    this.submitted = false;
    this.readonly = true;
  }

  clearImage() {
    this.filename = "";
  }

  crtForm() {
    this.ReleaseForm.reset();
    this.EventValue = "Save";
    this.submitted = false;
    this.readonly = false;
  }

  
}
