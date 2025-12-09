import { create } from 'zustand';
import { bookService } from '@/lib/services/bookService';
import { Book, CreateBookDto } from '@/types/book';
import toast from 'react-hot-toast';

interface BookState {
  myBooks: Book[];
  publicBooks: Book[];
  currentBook: Book | null;
  isLoading: boolean;
}

interface BookActions {
  fetchMyBooks: (userId: string) => Promise<void>;
  addBook: (data: CreateBookDto) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;
  fetchAllBooks: () => Promise<void>;
  fetchBookById: (id: string) => Promise<void>;
  clearCurrentBook: () => void;
}

interface IBookStore extends BookState, BookActions {}

const initialState : BookState = {
    myBooks: [],
    publicBooks: [],
    currentBook: null,
    isLoading: false,
};

export const useBookStore = create<IBookStore>((set) => ({
  ...initialState,

  fetchMyBooks: async (userId: string) => {

    set({ isLoading: true });
    try {
      const books = await bookService.getUserBooks(userId);
      set({ myBooks: books });
    } catch (error) {
      console.error(error);
      toast.error('Не вдалося завантажити список книг');
    } finally {
      set({ isLoading: false });
    }
  },

  addBook: async (data: CreateBookDto) => {
    try {
      const newBook = await bookService.createBook(data);
      set((state) => ({ 
        myBooks: [newBook, ...state.myBooks] 
      }));
      toast.success('Книгу успішно додано');
    } catch (error) {
      console.error(error);
      toast.error('Помилка при додаванні книги');
      throw error; 
    }
  },

  deleteBook: async (bookId: string) => {
    try {
      await bookService.deleteBook(bookId);
      set((state) => ({
        myBooks: state.myBooks.filter((book) => book.id !== bookId)
      }));
      toast.success('Книгу видалено');
    } catch (error) {
      console.error(error);
      toast.error('Не вдалося видалити книгу');
    }
  },
  fetchAllBooks: async () => {
    set({ isLoading: true });
    try {
      const books = await bookService.getAllBooks();
      set({ publicBooks: books });
    } catch (error) {
      console.error(error);
      toast.error('Не вдалося завантажити список книг');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBookById: async (id: string) => {
    set({ isLoading: true, currentBook: null });
    try {
      const book = await bookService.getBookById(id);
      if (!book) {
        toast.error('Книгу не знайдено');
      }
      set({ currentBook: book });
    } catch (error) {
      console.error(error);
      toast.error('Помилка при завантаженні книги');
    } finally {
      set({ isLoading: false });
    }
  },
  
  clearCurrentBook: () => set({ currentBook: null }),
}));