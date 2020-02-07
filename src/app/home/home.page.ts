import { Component, ViewEncapsulation } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePage {
	
  isDismissing: boolean;
  isShowing: boolean;
  data:any = {};
  temp:any = {};


  changeDisplay(coll, display){
    for(var i=0, len=coll.length; i<len; i++){
        coll[i].style["display"] = display;
    }
  }

  getIngradients(){
    console.log('Getting Ingradients from : '+ this.data.getUrl);
    var link = this.data.getUrl +'rest-popular-ingredients.php';

    this.http.get(link)
      .subscribe(data => {
      this.data.response = data;
      this.data.pingradientsData = data;
      //console.log(data);
     }, error => {
      if(error.message == "Http failure response for "+ link +": 0 Unknown Error"){
        error.message = "Cannot connect to internet. Please check you internet connection.";
      }
      var temp = {'status':'Error', 'message':error.message};
      //console.log(temp);
      this.data.response = temp;
    });
  };
  

  constructor(public http: HttpClient,public loadingController: LoadingController) {
    this.data.username = '';
    //this.data.ingradientids = '';
    //this.data.getUrl = 'https://etitbit.com/wp-json/wp/v2/'; //enable for test server
    //this.data.getUrl = 'https://bartender.com/wp-json/wp/v2/'; //enable for live server
    this.data.getUrl = 'https://wordpressss.com/wp-content/themes/abomb/'; //enable for live server
    //this.data.pingradients = ['Lemon', 'Wine', 'Vodka', 'Juice', 'Ice', 'Garnish', 'Syrup', 'Rum', 'Simple', 'Sugar', 'Beer', 'Cream', 'Apple', 'Water', 'Twist', 'Puree'];
    this.data.response = '';
    this.data.cocktails = '';
 
    this.http = http;

    //getting Ingradients
    this.getIngradients();
  }
  
  /** Loader */
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading...'
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }
  
  async hideLoader() {
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 1000);
  }
  /** Loader */
  
  submit() {
	this.presentLoading();
    //var ingradientids = this.data.ingradientids;
    var myData = this.data.username;
    if(myData == ""){
      //var link = 'http://etitbit.com/wp-json/wp/v2/mcm_cocktail?tags=';
      var link = this.data.getUrl +'rest-cocktail-builder.php';
      //var link = '/api';
    }else{
      //var link = 'http://etitbit.com/wp-json/wp/v2/mcm_cocktail?tags='+ ingradientids;
      //var link = this.data.getUrl +'rest-cocktail-builder.php?c='+ myData;
      var link = this.data.getUrl +'rest-cocktail-builder.php';
      //var link = '/api';
    }
    
    //console.log('Searching...');
    //console.log(link);
	var postData = {
        "c": myData
    }

    this.http.post(link, postData)
    .subscribe(rdata => {
      this.data.response = rdata;
		console.log(rdata);
      Object.keys(rdata).forEach(function(key){
        //console.log(key + '=' + rdata[key].title.rendered);
        //var media_id = rdata[key].featured_media;
        //console.log('Media Id' + '=' + media_id);
        //rdata[key].featured_image = '/assets/shapes.svg';
        
        /*if(media_id !== 0){
            //this.getCocktailImage(media_id);
            //console.log('Getting Ingradients...');
              var link = this.data.getUrl +'media/'+ media_id;

              this.http.get(link)
                .subscribe(data => {
                //console.log(data.guid.rendered);
                rdata[key].featured_image = data.guid.rendered;
              }, error => {
                /*if(error.message == "Http failure response for "+ link +": 0 Unknown Error"){
                  error.message = "Cannot connect to internet. Please check you internet connection.";
                }
                var temp = {'status':'Error', 'message':error.message};
                //console.log(temp);
                this.data.response = temp;*/
                /*rdata[key].featured_image = '/assets/shapes.svg';
              });
          }else{
            rdata[key].featured_image = '/assets/shapes.svg';
          }*/

      }.bind(this));
      //console.log(rdata);
      this.data.cocktails = rdata;
	  this.hideLoader();
     //this.data.cocktails = data;
     //console.log(data);
    }, error => {
      if(error.message == "Http failure response for "+ link +": 0 Unknown Error"){
        error.message = "Cannot connect to internet. Please check you internet connection.";
      }
      var temp = {'status':'Error', 'message':error.message};
      console.log(error);
      this.data.response = temp;
	  this.hideLoader();
    });
    this.showless();
  }

  addIngradient(pingradient, pingradientid){
    //console.log(pingradient);
    if(this.data.username == ''){
      this.data.username = pingradient;
    }else{
      this.data.username = this.data.username +', '+ pingradient;
    }
    /*if(this.data.ingradientids == ''){
      this.data.ingradientids = pingradientid;
    }else{
      this.data.ingradientids = this.data.ingradientids +', '+ pingradientid;
    }*/
  }

  showmore()
  {
    var acoll = document.getElementsByClassName("more-items");
    this.changeDisplay(acoll, 'block');
    var bcoll = document.getElementsByClassName("less-items");
    this.changeDisplay(bcoll, 'none');
  }
  showless()
  {
    var acoll = document.getElementsByClassName("more-items");
    this.changeDisplay(acoll, 'none');
    var bcoll = document.getElementsByClassName("less-items");
    this.changeDisplay(bcoll, 'block');
  }
}
