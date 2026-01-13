export interface CardsResponse {
  url: string;
  uuid: string;
  title: string;
  content_type: ContentType;
}

export enum ContentType {
  ImageJPEG = 'image/jpeg',
}
