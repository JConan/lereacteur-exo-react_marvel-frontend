export interface Thumbnail {
  path: string;
  extension: string;
}

export interface Comic {
  thumbnail: Thumbnail;
  _id: string;
  title: string;
  description: string;
  __v: number;
}

export interface Character {
  thumbnail: Thumbnail;
  comics: string[];
  _id: string;
  name: string;
  description: string;
  __v: number;
}

export interface GetComicsResponse {
  count: number;
  limit: number;
  comics: Comic[];
}

export interface GetCharactersResponse {
  count: number;
  limit: number;
  results: Character[];
}
