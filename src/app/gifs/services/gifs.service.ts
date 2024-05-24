import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'IVl1Gh5DoXwHstkujfBEx5d3R5ieP80p';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs'

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    console.log('Gifs Service Ready');
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  searchTag(tag: string): void {
    if(tag.length === 0) return;
    this.organizeHistory(tag);

    // fetch('https://api.giphy.com/v1/gifs/search?api_key=IVl1Gh5DoXwHstkujfBEx5d3R5ieP80p&q=madrid&limit=10')
    //   .then(res => res.json())
    //   .then(data => console.log(data));

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', 10)
      .set('q', tag);

    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params })
      .subscribe(res => {

        this.gifList = res.data;
        // console.log({gifs: this.gifList});

      });
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this.tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag: string)=> oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory.splice(10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

}
