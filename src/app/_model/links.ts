export class Links {
  id!: number;
  type!: number;
  title!: string;
  url!: string;
  picture!: string;
  profileId!: number;
  clickCount!: number;

  constructor(
    id: number,
    type: number,
    title: string,
    url: string,
    picture: string,
    profileId: number,
    clickCount: number
  ) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.url = url;
    this.picture = picture;
    this.profileId = profileId;
    this.clickCount = clickCount;
  }
}
