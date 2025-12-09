export interface Book {
  id: string;
  name: string;
  author: string;
  photoUrl: string;
  ownerId: string;
  createdAt: string;
}

export interface CreateBookDto {
  name: string;
  author: string;
  file: File;
  ownerId: string;
}