import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { DataService } from 'app/shared/mixins';
import { exhaustMap, map, Observable, of, take } from 'app/shared/utils/rxjs-exports';
import { User } from 'firebase/app';
import { Constitution, UserBio, UserInfo } from '../../shared/models';

@Injectable()
export class UserService extends DataService<UserInfo> {
  constructor(protected afAuth: AngularFireAuth, protected afs: AngularFirestore) {
    super(afAuth, afs, 'users', true);
  }

  public static mapUserInfo(userInfo: UserInfo): UserInfo {
    return userInfo ? new UserInfo(
      userInfo.displayName,
      userInfo.email,
      userInfo.emailVerified,
      userInfo.metadata,
      userInfo.phoneNumber,
      userInfo.photoURL,
      userInfo.providerData,
      userInfo.providerId,
      userInfo.uid,
      userInfo.userAdditional,
      userInfo.bio ? new UserBio(
        userInfo.bio.dateOfBirth,
        userInfo.bio.gender,
        userInfo.bio.goal,
        userInfo.bio.level,
        userInfo.bio.summary,
        userInfo.bio.motherHood,
        userInfo.bio.constitution
        // userInfo.bio.metabolicType,
        // userInfo.bio.geneticType
      ) : null
    ) : null;
  }

  public calculateConstitution(constitution: Constitution): void {
    this.resetTotalDoshaPoints(constitution);
    this.assignDoshaPoints(constitution);
    this.calculateTotalDoshaPoints(constitution);
    this.calculateDoshaBodyInfluence(constitution);
    this.calculateDoshaMindInfluence(constitution);
    this.calculateTotalDoshaInfluence(constitution);
    this.setDominantDoshaAndBodyType(constitution);
  }

  // public calculateGeneticType(geneticType: GeneticType): void {
  //   this.resetTotalGeneticFeaturesPoints(geneticType);
  //   this.assignGeneticFeaturesPoints(geneticType);
  //   this.setDominantGeneticFeaturesAndBodyType(geneticType);
  // }
  //
  // public calculateMetabolicType(metabolicType: MetabolicType): void {
  //   this.resetTotalMetabolicFeaturesPoints(metabolicType);
  //   this.assignMetabolicFeaturesPoints(metabolicType);
  //   this.setDominantMetabolicFeatures(metabolicType);
  // }

  // TODO: https://firebase.google.com/support/privacy/clear-export-data
  public deleteUserInfo(): Promise<void> {
    return this.deleteData();
  }

  public getUserChanges(): Observable<UserInfo> {
    return this.afAuth.authState.pipe(exhaustMap((user: User) => {
      if (user) {

        if (!this.currentDataDoc$) {
          this.currentDataDoc$ = this.dataCollection$.doc<UserInfo>(user.uid);
        }

        return this.currentDataDoc$.valueChanges().pipe(map((userInfo: UserInfo) => UserService.mapUserInfo(
          userInfo)));
      } else {
        return of(null);
      }
    }));
  }

  public getUserInfo(): Promise<UserInfo> {
    return this.getUserChanges().pipe(take(1)).toPromise();
  }

  public async saveUserInfo(user: UserInfo): Promise<UserInfo> {
    await this.afAuth.auth.currentUser.updateProfile({
      displayName: user.displayName, photoURL: user.photoURL
    });
    await this.afAuth.auth.currentUser.updateEmail(user.email);
    await this.saveData(user);

    return user;
  }

  private assignBodyFeaturesPoints(constitution: Constitution): void {
    for (const key in constitution.vata.body) {
      if (key !== 'total') {
        if (Reflect.has(constitution.vata.body, key) && constitution.vata.body[key]) {
          constitution.vata.body.total++;
        }

        if (Reflect.has(constitution.pitta.body, key) && constitution.pitta.body[key]) {
          constitution.pitta.body.total++;
        }

        if (Reflect.has(constitution.kapha.body, key) && constitution.kapha.body[key]) {
          constitution.kapha.body.total++;
        }
      }
    }
  }

  private assignDoshaPoints(constitution: Constitution): void {
    this.assignBodyFeaturesPoints(constitution);
    this.assignMindFeaturesPoints(constitution);
  }

  // private assignGeneticFeaturesPoints(geneticType: GeneticType): void {
  //   for (const key in geneticType.frigid) {
  //     if (key !== 'total') {
  //       if (Reflect.has(geneticType.frigid, key) && geneticType.frigid[key]) {
  //         geneticType.frigid.total++;
  //       }
  //
  //       if (Reflect.has(geneticType.torrid, key) && geneticType.torrid[key]) {
  //         geneticType.torrid.total++;
  //       }
  //
  //       if (Reflect.has(geneticType.temperate, key) && geneticType.temperate[key]) {
  //         geneticType.temperate.total++;
  //       }
  //     }
  //   }
  // }

  // private assignMetabolicFeaturesPoints(metabolicType: MetabolicType): void {
  //   for (const key in metabolicType.protein) {
  //     if (key !== 'total') {
  //       if (Reflect.has(metabolicType.protein, key) && metabolicType.protein[key]) {
  //         metabolicType.protein.total++;
  //       }
  //
  //       if (Reflect.has(metabolicType.carbo, key) && metabolicType.carbo[key]) {
  //         metabolicType.carbo.total++;
  //       }
  //
  //       if (Reflect.has(metabolicType.mixed, key) && metabolicType.mixed[key]) {
  //         metabolicType.mixed.total++;
  //       }
  //     }
  //   }
  // }

  private assignMindFeaturesPoints(constitution: Constitution): void {
    for (const key in constitution.vata.mind) {
      if (key !== 'total') {
        if (Reflect.has(constitution.vata.mind, key) && constitution.vata.mind[key]) {
          constitution.vata.mind.total++;
        }

        if (Reflect.has(constitution.pitta.mind, key) && constitution.pitta.mind[key]) {
          constitution.pitta.mind.total++;
        }

        if (Reflect.has(constitution.kapha.mind, key) && constitution.kapha.mind[key]) {
          constitution.kapha.mind.total++;
        }
      }
    }
  }

  private calculateDoshaBodyInfluence(constitution: Constitution): void {
    const bodyPoints: number =
      constitution.vata.body.total +
      constitution.pitta.body.total +
      constitution.kapha.body.total;

    constitution.vata.bodyInfluence = Math.round(
      (constitution.vata.body.total * 100) / bodyPoints
    );
    constitution.pitta.bodyInfluence = Math.round(
      (constitution.pitta.body.total * 100) / bodyPoints
    );
    constitution.kapha.bodyInfluence = Math.round(
      (constitution.kapha.body.total * 100) / bodyPoints
    );
  }

  private calculateDoshaMindInfluence(constitution: Constitution): void {
    const mentalPoints: number =
      constitution.vata.mind.total +
      constitution.pitta.mind.total +
      constitution.kapha.mind.total;

    constitution.vata.mindInfluence = Math.round(
      (constitution.vata.mind.total * 100) / mentalPoints
    );
    constitution.pitta.mindInfluence = Math.round(
      (constitution.pitta.mind.total * 100) / mentalPoints
    );
    constitution.kapha.mindInfluence = Math.round(
      (constitution.kapha.mind.total * 100) / mentalPoints
    );
  }

  private calculateTotalDoshaInfluence(constitution: Constitution): void {
    const totalPoints: number =
      constitution.vata.total + constitution.pitta.total + constitution.kapha.total;

    constitution.vata.totalInfluence = Math.round(
      (constitution.vata.total * 100) / totalPoints
    );
    constitution.pitta.totalInfluence = Math.round(
      (constitution.pitta.total * 100) / totalPoints
    );
    constitution.kapha.totalInfluence = Math.round(
      (constitution.kapha.total * 100) / totalPoints
    );
  }

  private calculateTotalDoshaPoints(constitution: Constitution): void {
    constitution.vata.total =
      constitution.vata.body.total + constitution.vata.mind.total;
    constitution.pitta.total =
      constitution.pitta.body.total + constitution.pitta.mind.total;
    constitution.kapha.total =
      constitution.kapha.body.total + constitution.kapha.mind.total;
  }

  private resetTotalDoshaPoints(constitution: Constitution): void {
    constitution.vata.body.total = 0;
    constitution.pitta.body.total = 0;
    constitution.kapha.body.total = 0;
    constitution.vata.mind.total = 0;
    constitution.pitta.mind.total = 0;
    constitution.kapha.mind.total = 0;
  }

  // private resetTotalGeneticFeaturesPoints(geneticType: GeneticType): void {
  //   geneticType.frigid.total = 0;
  //   geneticType.torrid.total = 0;
  //   geneticType.temperate.total = 0;
  // }
  //
  // private resetTotalMetabolicFeaturesPoints(metabolicType: MetabolicType): void {
  //   metabolicType.protein.total = 0;
  //   metabolicType.carbo.total = 0;
  //   metabolicType.mixed.total = 0;
  // }

  private setDominantDoshaAndBodyType(constitution: Constitution): void {
    const maxPoints: number = Math.max(
      constitution.vata.totalInfluence,
      constitution.pitta.totalInfluence,
      constitution.kapha.totalInfluence
    );

    const isVataPitta: boolean = Math.abs(constitution.vata.totalInfluence - constitution.pitta.totalInfluence) <= 5;
    const isPittaKapha: boolean = Math.abs(constitution.pitta.totalInfluence - constitution.kapha.totalInfluence) <= 5;
    const isKaphaVata: boolean = Math.abs(constitution.kapha.totalInfluence - constitution.vata.totalInfluence) <= 5;

    if (isVataPitta && isPittaKapha && isKaphaVata) {
      // Is tri dosha/body type
      constitution.dominantDosha = 'Vata-Pitta-Kapha';
      constitution.bodyType = 'Ectomorph-Mesomorph-Endomorph';
    } else {
      // Is dual dosha/body type
      if (maxPoints === constitution.vata.totalInfluence) {
        if (isVataPitta) {
          constitution.dominantDosha = 'Vata-Pitta';
          constitution.bodyType = 'Ectomorph-Mesomorph';
        } else if (isKaphaVata) {
          constitution.dominantDosha = 'Vata-Kapha';
          constitution.bodyType = 'Ectomorph-Endomorph';
        } else {
          // Is single dosha/body type
          constitution.dominantDosha = 'Vata';
          constitution.bodyType = 'Ectomorph';
        }
      } else if (maxPoints === constitution.pitta.totalInfluence) {
        if (isVataPitta) {
          constitution.dominantDosha = 'Pitta-Vata';
          constitution.bodyType = 'Mesomorph-Ectomorph';
        } else if (isPittaKapha) {
          constitution.dominantDosha = 'Pitta-Kapha';
          constitution.bodyType = 'Mesomorph-Endomorph';
        } else {
          // Is single dosha/body type
          constitution.dominantDosha = 'Pitta';
          constitution.bodyType = 'Mesomorph';
        }
      } else if (maxPoints === constitution.kapha.totalInfluence) {
        if (isKaphaVata) {
          constitution.dominantDosha = 'Kapha-Vata';
          constitution.bodyType = 'Endomorph-Ectomorph';
        } else if (isPittaKapha) {
          constitution.dominantDosha = 'Kapha-Pitta';
          constitution.bodyType = 'Endomorph-Mesomorph';
        } else {
          // Is single dosha/body type
          constitution.dominantDosha = 'Kapha';
          constitution.bodyType = 'Endomorph';
        }
      }
    }
  }

  // private setDominantGeneticFeaturesAndBodyType(geneticType: GeneticType): void {
  //   const maxPoints: number = Math.max(
  //     geneticType.frigid.total,
  //     geneticType.torrid.total,
  //     geneticType.temperate.total
  //   );
  //
  //   if (maxPoints === geneticType.frigid.total) {
  //     geneticType.dominant = 'Frigid';
  //   } else if (maxPoints === geneticType.torrid.total) {
  //     geneticType.dominant = 'Torrid';
  //   } else if (maxPoints === geneticType.temperate.total) {
  //     geneticType.dominant = 'Temperate';
  //   }
  // }
  //
  // private setDominantMetabolicFeatures(metabolicType: MetabolicType): void {
  //   const maxPoints: number = Math.max(
  //     metabolicType.protein.total,
  //     metabolicType.carbo.total,
  //     metabolicType.mixed.total
  //   );
  //
  //   const isProteinCarbo = Math.abs(metabolicType.protein.total - metabolicType.carbo.total) <= 5;
  //   const isCarboMixed = Math.abs(metabolicType.carbo.total - metabolicType.mixed.total) <= 5;
  //   const isMixedProtein = Math.abs(metabolicType.mixed.total - metabolicType.protein.total) <= 5;
  //
  //   if (isProteinCarbo && isCarboMixed && isMixedProtein) {
  //     metabolicType.dominant = 'Mixed';
  //   } else {
  //     if (maxPoints === metabolicType.protein.total) {
  //       if (isProteinCarbo) {
  //         metabolicType.dominant = 'Mixed';
  //       } else if (isMixedProtein) {
  //         metabolicType.dominant = 'Protein-Mixed';
  //       } else {
  //         metabolicType.dominant = 'Protein';
  //       }
  //     } else if (maxPoints === metabolicType.carbo.total) {
  //       if (isProteinCarbo) {
  //         metabolicType.dominant = 'Mixed';
  //       } else if (isCarboMixed) {
  //         metabolicType.dominant = 'Carbo-Mixed';
  //       } else {
  //         metabolicType.dominant = 'Carbo';
  //       }
  //     } else if (maxPoints === metabolicType.mixed.total) {
  //       if (isMixedProtein) {
  //         metabolicType.dominant = 'Mixed-Protein';
  //       } else if (isCarboMixed) {
  //         metabolicType.dominant = 'Mixed-Carbo';
  //       } else {
  //         metabolicType.dominant = 'Mixed';
  //       }
  //     }
  //   }
  // }
}
