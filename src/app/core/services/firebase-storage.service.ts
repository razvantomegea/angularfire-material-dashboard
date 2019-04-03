import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { Upload } from 'app/shared/models';
import { finalize, Subscription } from 'app/shared/utils/rxjs-exports';
import { FirebaseError } from 'firebase/app';

@Injectable()
export class FirebaseStorageService {
  private currentPath: string;
  private storageCollection$: AngularFirestoreCollection<{ name: string }[]>;
  private storageRef: AngularFireStorageReference;

  constructor(
    private afs: AngularFirestore,
    private loadingBar: LoadingBarService,
    private storage: AngularFireStorage
  ) {
    this.storageCollection$ = this.afs.collection('storage');
  }

  public async clearStorage(uid: string): Promise<any> {
    const paths: { name: string }[] = await this.getStoragePaths(uid);

    return paths ? Promise.all(paths.map((path: { name: string }) => this.storage.ref(path.name).delete().toPromise())) : null;
  }

  public getDownloadUrl(): Promise<string> {
    return this.storageRef.getDownloadURL().toPromise();
  }

  public async uploadImage(uid: string, path: string, img: Upload): Promise<any> {
    this.currentPath = `${path}/${img.file.name}`;
    this.storageRef = this.storage.ref(`${uid}/${this.currentPath}`);
    const uploadTask: AngularFireUploadTask = this.storageRef.put(img.file);
    this.loadingBar.start();
    const percentageSubscription: Subscription = this.initUploadProgress(uploadTask);
    const downloadUrl = await this.completeUploadTask(uid, uploadTask);
    percentageSubscription.unsubscribe();

    return downloadUrl;
  }

  private completeUploadTask(uid: string, uploadTask: AngularFireUploadTask): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadSubscription: Subscription = uploadTask.snapshotChanges().pipe(finalize(async () => {
        this.loadingBar.complete();
        uploadSubscription.unsubscribe();

        try {
          await this.saveStoragePath(uid);
        } catch (e) {
          this.storageRef.delete();
          reject(e);
        }

        Reflect.deleteProperty(this, 'currentPath');
        resolve(await this.getDownloadUrl());
      })).subscribe();
    });
  }

  private getStoragePaths(uid: string): Promise<{ name: string }[]> {
    return this.storageCollection$.doc(uid).collection<{ name: string }>('paths').valueChanges().toPromise();
  }

  private initUploadProgress(uploadTask: AngularFireUploadTask): Subscription {
    return uploadTask.percentageChanges().subscribe(
      (percentage: number) => {
        this.loadingBar.increment(percentage);
      },
      (err: FirebaseError) => {
        this.loadingBar.complete();
        throw err;
      }
    );
  }

  private saveStoragePath(uid: string): Promise<DocumentReference> {
    return this.storageCollection$.doc(uid).collection<{ name: string }>('paths').add({ name: this.currentPath });
  }
}
