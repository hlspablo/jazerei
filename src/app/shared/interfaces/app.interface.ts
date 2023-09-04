export interface GameInfo {
  id?: string
  maxWidth?: string
  //avatarUrl: string
  imagesUrls: string[]
  gameOwner: string
  gameName: string
  gameDescription: string
  gamePlatform: string
}

export interface MyLocation {
  id: string
  name: string
  name_lowercase: string
}
