import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction,
  DocumentReference
} from '@angular/fire/firestore';
import * as moment from 'moment';

import { TrendsQuery } from 'app/dashboard/shared/model';
import { BehaviorSubject, exhaustMap, map, Observable, of, switchMap } from 'app/shared/utils/rxjs-exports';
import { firestore, User } from 'firebase/app';

export const CURRENT: string = moment().format('YYYY-MM-DD');
const TRENDS_PATH = 'trends';
const TRENDS_INTERVAL = 7;

export class DataService<T> {
  protected readonly dataCollection$: AngularFirestoreCollection<T>;
  protected currentDataDoc$: AngularFirestoreDocument<T>;
  protected historyData$: Observable<T[]>;
  protected historyDataSubject$: BehaviorSubject<string | null> = new BehaviorSubject(CURRENT);
  protected trendsCollection$: AngularFirestoreCollection<T>;
  protected trendsCollectionQueried$: Observable<T[]>;
  protected trendsQuerySubject$: BehaviorSubject<TrendsQuery>;
  private currentDataCollectionSubject$: BehaviorSubject<any>;
  private trendsQuery = new TrendsQuery(CURRENT, TRENDS_INTERVAL);

  /**
   * @desc Service used for Firebase data management
   * @param {AngularFireAuth} afAuth - AngularFireAuth dependency
   * @param {AngularFirestore} afs - AngularFirestore dependency
   * @param {string} collectionName - The collection name
   * @param {boolean} [noHistory=false] - No trends and history tracking
   * @param {string|boolean} [customCollection=false] - User independent data (e.g. activities) or lower hierarchy collection without
   * tracking (e.g. foods/userId/list)
   * @param {boolean} [isPersistent=false] - Flag the indicates if the data should not change daily
   */
  constructor(
    protected afAuth: AngularFireAuth,
    protected afs: AngularFirestore,
    private collectionName: string,
    private noHistory: boolean = false,
    private customCollection: string | boolean = false,
    private isPersistent: boolean = false
  ) {
    this.dataCollection$ = this.afs.collection(this.collectionName);
    this.afAuth.authState.pipe(exhaustMap((user: User) => {
      if (user) {
        if (this.customCollection) {
          this.checkAndSetupCustomData(this.collectionName, this.customCollection);
        } else {
          this.setupData();
        }
      }

      return of(user);
    }));
  }

  // FIXME: Not querying correctly (foods.desc.name)
  public getQueriedCollectionChanges(collectionName: string, collectionPath?: string, queryProp: string = 'name'): Observable<any[]> {
    this.checkAndSetupCustomData(collectionName, collectionPath, queryProp);
    const parsedCollectionQueriedName = `${collectionName}CollectionQueried$`;

    return this[parsedCollectionQueriedName];
  }

  public queryCollection(query: string, collectionName?: string): void {
    if (collectionName) {
      const parsedSubjectName = `${collectionName}QuerySubject$`;

      if (this[parsedSubjectName]) {
        this[parsedSubjectName].next(query);
      }
    } else if (this.currentDataCollectionSubject$) {
      this.currentDataCollectionSubject$.next(query);
    }
  }

  public async saveCustomData(collectionName: string, collectionPath: string, data: any, docName?: string): Promise<any> {
    this.checkAndSetupCustomData(collectionName, collectionPath, 'name', docName);
    const parsedCollectionName = `${collectionName}Collection$`;
    const parsedDocName = `${docName}Doc$`;
    const parsedData = JSON.parse(JSON.stringify(data));
    // const hierarchy: { [prop: string]: any[] } = this.getAndDeleteHierarchy(parsedData);

    if (docName) {
      await this[parsedDocName].set(parsedData, { merge: true });
      // await this.saveHierarchy(this[parsedDocName], hierarchy);
    } else {
      if (!data.id) {
        const ref: DocumentReference = await this[parsedCollectionName].add(parsedData);
        parsedData.id = data.id = ref.id;
        await ref.set(parsedData, { merge: true });
        // await this.saveHierarchy(ref, hierarchy);
      } else {
        await this[parsedCollectionName].doc(data.id).set(parsedData, { merge: true });
        // await this.saveHierarchy(this[parsedCollectionName].doc(data.id), hierarchy);
      }
    }

    return parsedData;
  }

  protected changeHistoryDate(date: string): void {
    this.historyDataSubject$.next(date);
  }

  protected deleteCustomData(collectionName: string, userCollection: string, id: string): Promise<void> {
    this.checkAndSetupCustomData(collectionName, userCollection);

    return this[`${collectionName}Collection$`].doc(id).delete();
  }

  protected deleteData(): Promise<void> {
    return this.currentDataDoc$.delete();
  }

  protected getHistoryData(): Observable<T[]> {
    if (!this.currentDataDoc$) {
      this.setupData();
    }

    return this.historyData$;
  }

  protected queryTrends(query: TrendsQuery): void {
    this.trendsQuery = query || this.trendsQuery;
    this.trendsQuerySubject$.next(this.trendsQuery);
  }

  protected async saveData(data: any): Promise<any> {
    if (!this.currentDataDoc$) {
      this.setupData();
    }

    data.id = data.id || this.currentDataDoc$.ref.id;
    const parsedData: any = JSON.parse(JSON.stringify(data));
    // const hierarchy: { [prop: string]: any[] } = this.getAndDeleteHierarchy(parsedData);
    await this.currentDataDoc$.set(parsedData);
    // await this.saveHierarchy(this.currentDataDoc$, hierarchy);

    return data;
  }

  protected subscribeToDataChanges(): Observable<T> {
    if (!this.currentDataDoc$) {
      this.setupData();
    }

    return this.afAuth.auth.currentUser ? this.currentDataDoc$.valueChanges() : of(null);
  }

  protected subscribeToTrendsChanges(query?: TrendsQuery): Observable<T[]> {
    this.trendsQuery = query || this.trendsQuery;

    if (!this.currentDataDoc$) {
      this.setupData();
    }

    return this.trendsCollectionQueried$ || of([]);
  }

  private checkAndSetupCustomData(
    collectionName: string,
    collectionPath?: string | boolean,
    queryProp: string = 'name',
    docName?: string
  ): void {
    const parsedCollectionName = `${collectionName}Collection$`;
    const parsedDocName = `${docName}Doc$`;
    const parsedSubjectName = `${collectionName}Subject`;
    const parsedCollectionQueriedName = `${collectionName}CollectionQueried$`;

    if (!this[parsedCollectionName]) {
      this[parsedCollectionName] = typeof collectionPath === 'string' && collectionPath.length ? this.afs.collection(collectionName)
        .doc(this.afAuth.auth.currentUser.uid)
        .collection(
          collectionPath) : this.afs.collection(collectionName);
      this[parsedSubjectName] = new BehaviorSubject(null);
      this[parsedCollectionQueriedName] = this[parsedCollectionName].valueChanges();
      // this[parsedCollectionQueriedName] = this[parsedSubjectName].pipe(
      //   switchMap((query: string) => this.afs.collection(
      //     collectionName,
      //     (ref: firestore.CollectionReference) => name ? ref.where(queryProp, '==', query) : ref
      //   ).snapshotChanges()),
      //   map((actions: DocumentChangeAction<any>[]) => actions.map((action: DocumentChangeAction<any>) => {
      //     const { doc } = action.payload;
      //
      //     return { id: doc.id, ...doc.data() };
      //   }))
      // );
    }

    if (docName && !this[parsedDocName]) {
      this[parsedDocName] = this[parsedCollectionName].doc(docName);
    }
  }

  private getAndDeleteHierarchy(data: any): { [prop: string]: any[] } {
    const hierarchy: { [prop: string]: any[] } = {};

    Object.keys(data).forEach((key: string) => {
      const value: any = data[key];

      if (value && Array.isArray(value) && !!value.length) {
        hierarchy[key] = value;
        Reflect.deleteProperty(data, key);
      }
    });

    return hierarchy;
  }

  private async saveHierarchy(document: DocumentReference | AngularFirestoreDocument, hierarchy: { [prop: string]: any[] }): Promise<void> {
    Object.keys(hierarchy).forEach(async (key: string) => {
      hierarchy[key].forEach(async (data: any) => {
        await (<DocumentReference>document).collection(key).add(data);
      });
    });
  }

  private setupData(user?: User): void {
    const currentUser: User = user || this.afAuth.auth.currentUser;

    if (currentUser) {
      this.currentDataDoc$ = this.dataCollection$.doc(currentUser.uid);

      if (!this.noHistory) {
        this.trendsCollection$ = this.currentDataDoc$.collection(TRENDS_PATH);

        if (!this.isPersistent) {
          this.currentDataDoc$ = this.trendsCollection$.doc(CURRENT);
        }

        this.trendsQuerySubject$ = new BehaviorSubject(this.trendsQuery);
        this.trendsCollectionQueried$ = this.trendsQuerySubject$.pipe(switchMap((query: TrendsQuery) => (this.isPersistent
          ? this.currentDataDoc$ : this.dataCollection$.doc(currentUser.uid)).collection(
          TRENDS_PATH,
          (ref: firestore.CollectionReference) => ref.where('timestamp', '<=', query.date).limit(query.interval)
        ).snapshotChanges()), map((actions: DocumentChangeAction<T>[]) => actions.map((action: DocumentChangeAction<any>) => {
          const { doc } = action.payload;

          return <T>{ id: doc.id, ...doc.data() };
        })));
        this.historyData$ = this.historyDataSubject$.pipe(
          switchMap((timestamp: string) => this.currentDataDoc$.collection(
            TRENDS_PATH,
            (ref: firestore.CollectionReference) => ref.where('timestamp', '==', timestamp)
          ).snapshotChanges()),
          map((actions: DocumentChangeAction<T>[]) => actions.map((action: DocumentChangeAction<any>) => {
            const { doc } = action.payload;

            return <T>{ id: doc.id, ...doc.data() };
          }))
        );
      }
    }
  }
}
