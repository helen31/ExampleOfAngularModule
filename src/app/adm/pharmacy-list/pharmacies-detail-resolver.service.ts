import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { map, take } from 'rxjs/internal/operators';

import { AdmService }  from '../adm.service';
import { PharmacyInterface } from './pharmacy.interface';

@Injectable()
export class PharmaciesDetailResolver implements Resolve<PharmacyInterface[]> {

  constructor(private corpService: AdmService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PharmacyInterface[]> {
    let id = +route.paramMap.get('id');
    console.log('paramMap',route.paramMap);
    console.log('outlet',route.outlet);

    return this.corpService.getPharmacies(id).pipe(
      take(1),
      map(
        pharmacies => {
          if (pharmacies.length != 0) {
            return pharmacies;
          } else { // id not found
            this.router.navigate(['/adm']);
            return null;
          }
        }
      )
    );
  }
}
