import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

  countries = [
    {
      id: 0,
      name: "ทั่วโลก",
      logo: "./assets/img/flag/world.png",
      countryCode: ""
    },
    {
      id: 1,
      name: "ไทย",
      logo: "./assets/img/flag/thailand.png",
      countryCode: "TH"
    },
    {
      id: 2,
      name: "จีน",
      logo: "./assets/img/flag/china.png",
      countryCode: "CN"
    },
    {
      id: 3,
      name: "สหรัฐอเมริกา",
      logo: "./assets/img/flag/usa.png",
      countryCode: "US"
    }
  ]

  summaryApiUrl = "https://api.covid19api.com/summary";
  newsApiUrl = "https://covid19-us-api.herokuapp.com/news";

  isCollapsed = true;
  countrySelected: any;
  currentDate = new Date();

  totalConfirmed: number = 0;
  totalDeaths: number = 0;
  totalRecovered: number = 0;
  totalRecovering: number = 0;

  news: any = [];

  ngOnInit() {
    this.getNewsData();
    this.selectCountry(this.countries[0].id);
  }

  getSummaryData(countryCode: string) {
    this.spinner.show();

    this.http.get(this.summaryApiUrl).subscribe((response: any) => {
      this.spinner.hide();
      this.currentDate = response.Date;
      if (countryCode == "") {
        this.totalConfirmed = response.Global.TotalConfirmed;
        this.totalDeaths = response.Global.TotalDeaths;
        this.totalRecovered = response.Global.TotalRecovered;
        this.totalRecovering = (this.totalConfirmed - this.totalRecovered)
      } else {
        var _countries = response.Countries;
        var _country = _countries.find(x => x.CountryCode == countryCode);
        this.totalConfirmed = _country.TotalConfirmed;
        this.totalDeaths = _country.TotalDeaths;
        this.totalRecovered = _country.TotalRecovered;
        this.totalRecovering = (this.totalConfirmed - this.totalRecovered)
      }
    })
  }

  getNewsData() {
    this.http.post(this.newsApiUrl, {
      "state": "CA",
      "topic": "Coronavirus"
    }).subscribe((response: any) => {
      if (response.success) {
        this.news = response.message;
      }
    })
  }

  selectCountry(id: number) {
    this.countrySelected = this.countries.find(x => x.id == id);
    this.getSummaryData(this.countrySelected.countryCode);
  }


}
