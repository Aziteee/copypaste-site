export interface IArticle {
  id: string
  text: string
  uploadTime: string
  likes: number
  uploader: string
  uploaderId?: string
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

export interface IAPISearchParams {
  q?: string,
  pp?: number,
  pn?: number
}

/**
 * 上传接口
 */
export interface IAPIUploadParams {
  text: string
}

export enum isLikedStatus {
  LIKED,
  UNLIKED,
  UNKNOWN
}

export interface IUserInfo {
  id: string
  name: string
  avatar: string
}

export interface IAPIPatchUserProfile {
  name?: string,
  avatar?: string
}

export interface IComment {
  id: string
  
  // 评论者信息
  uid: string
  avatar: string
  name: string

  content: string
  time: string
  agree: number
}
