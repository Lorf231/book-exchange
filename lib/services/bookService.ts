import { db, storage } from '@/lib/api/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDoc,
  getDocs, 
  deleteDoc, 
  doc,
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Book, CreateBookDto } from '@/types/book';

const COLLECTION_NAME = 'books';

export const bookService = {
  async getUserBooks(userId: string): Promise<Book[]> {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Book[];
  },

  async createBook({ name, author, file, ownerId }: CreateBookDto): Promise<Book> {
    const storageRef = ref(storage, `books/${ownerId}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const photoUrl = await getDownloadURL(storageRef);

    const newBookData = {
      name,
      author,
      photoUrl,
      ownerId,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), newBookData);

    return {
      id: docRef.id,
      ...newBookData
    };
  },

  async deleteBook(bookId: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, bookId);
    await deleteDoc(docRef);
  },
  async getAllBooks(): Promise<Book[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Book[];
  },

  async getBookById(bookId: string): Promise<Book | null> {
    const docRef = doc(db, COLLECTION_NAME, bookId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Book;
    } else {
      return null;
    }
  }
};