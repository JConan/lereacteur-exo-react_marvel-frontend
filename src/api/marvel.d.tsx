export interface Thumbnail {
  path: string;
  extension: string;
}

export interface Comic {
  thumbnail: string;
  _id: string;
  title: string;
  description: string;
  __v: number;
}

export interface GetComicsReturn {
  count: number;
  limit: number;
  comics: Comic[];
}
