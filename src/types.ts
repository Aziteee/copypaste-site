export interface IArticle {
  id: string,
  text: string,
  uploadTime: string,
  likes: number,
  uploader: string
}

export type IHistory = IArticle

export enum ArticleSortType {
  TIME = 'uploadTime', // 时间
  LIKES = 'likes', // 点赞数
  RANDOM = 'random', // 随机
}

export enum ArticleSortDirection {
  ASC = 1, // 升序
  DESC = -1, // 倒序
}

export type IQueryIndex = 'genshin' | 'diana' | 'taffy' | 'dxl'

export type IAPIQueryParams = Partial<{
  q: string,
  pp: number,
  pn: number,
  sort: ArticleSortType,
  direction: ArticleSortDirection
}>

export interface IAPIUploadParams {
  text: string,
  uploader: string
}

export enum isLikedStatus {
  LIKED,
  UNLIKED,
  UNKNOWN
}
