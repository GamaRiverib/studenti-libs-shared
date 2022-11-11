import { CollectionReference, Query } from '@google-cloud/firestore';
import { ICustomQuery, IEntity } from 'fireorm';

export class StartAfterQuery<T extends IEntity> {
  constructor(protected id: string) {}

  getStartAfterQuery(): ICustomQuery<T> {
    return async (
      query: Query,
      firestoreColRef: CollectionReference,
    ): Promise<Query> => {
      const docRef = firestoreColRef.doc(this.id);
      const snapshot = await docRef.get();
      return query.startAfter(snapshot);
    };
  }
}
