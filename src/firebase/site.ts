import { getAnalytic, getAuthService, getFirestoreService } from '.';
import { logEvent } from 'firebase/analytics';
import { collection, getDocs, DocumentData, QuerySnapshot, doc, query, where, addDoc, Timestamp, deleteDoc, getDoc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';

const SITE_COLLECTION_NAME = 'site';

export type SiteEntity = {
    id: string,
    yoneticiid: string,
    isim: string,
    aciklama: string,
    bloksayisi: number,
    dairesayisi: number,
    gorevlisayisi: number,
    type: string,
    adres: string,
    createdAt: firebase.firestore.Timestamp,
    updatedAt: firebase.firestore.Timestamp,
    options?: any,
}


export async function createSite(site: SiteEntity): Promise<any> {
    try {
        const db = getFirestoreService();

        const existingSiteQuerySnapshot: QuerySnapshot<DocumentData> = await getDocs(
            query(collection(db, SITE_COLLECTION_NAME), where('isim', '==', site.isim))
        );

        if (existingSiteQuerySnapshot.size > 0) {
            throw new Error(`"${site.isim}" adında bir site zaten var.`);
        }
        site.createdAt = Timestamp.fromDate(new Date());
        const docRef = await addDoc(collection(db, SITE_COLLECTION_NAME), site);

        logEvent(getAnalytic(), 'create_site');

        return { id: docRef.id };
    } catch (error) {
        console.error('Site oluşurken bir hata oluştu:', error);
        throw error;
    }
}

export async function deleteSite(id: string): Promise<void> {
    try {
        const db = getFirestoreService();
        const docRef = doc(db, SITE_COLLECTION_NAME, id);
        await deleteDoc(docRef);
        logEvent(getAnalytic(), 'delete_site');
    } catch (error) {
        console.error('Error deleting site:', error);
        throw error;
    }
}

export async function getSiteList(userId?: string): Promise<SiteEntity[]> {
    try {
        const db = getFirestoreService();
        const auth = getAuthService();
        const uid = userId || auth.currentUser!.uid;

        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
            query(collection(db, SITE_COLLECTION_NAME), where('yoneticiid', '==', uid))
        );

        const results: SiteEntity[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as SiteEntity));

        return results.sort((a, b) => a.isim.toUpperCase() > b.isim.toUpperCase() ? 1 : -1);
    } catch (error) {
        console.error('Error fetching site list:', error);
        throw error;
    }
}


export async function getSiteById(id: string): Promise<SiteEntity> {
    try {
      const db = getFirestoreService();
      const docRef = doc(db, SITE_COLLECTION_NAME, id);
      const documentSnapshot = await getDoc(docRef);
  
      if (documentSnapshot.exists()) {
        return { id, ...documentSnapshot.data() } as SiteEntity;
      } else {
        throw new Error(`Site with ID ${id} not found`);
      }
    } catch (error) {
      console.error('Error fetching bot by ID:', error);
      throw error;
    }
  }