import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private dbService:DatabaseService) { }

  getDialCode(countryName: string): Observable<string | null> {
    return this.dbService.getCountries().pipe(
      map(countries => {
        const country = countries.find(c => c.name === countryName);
        return country ? country.dial_code : null;
      })
    );
  }
}
