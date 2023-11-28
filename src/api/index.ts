import { type IAPIQueryParams, type IAPIUploadParams, ArticleSortType, ArticleSortDirection, IAPISearchParams, IAPIPatchUserProfile } from "@/types"
import requests from "./request"

function getTokenConfig(token: string) {
  return { headers: { Authorization: 'Bearer ' + token } }
}

/**
 * 随机一句语句
 */
export function getRandomArticle() {
  return requests.get('/articles', { params: { pp: 1, sort: ArticleSortType.RANDOM } })
}

/**
 * 旧的搜索接口（支持搜索语句）
 * @param params 
 */
export function getSearchResults(params: IAPIQueryParams) {
  return requests.get('/articles', { params })
}

/**
 * 通过语句id查询语句
 * @param id 
 */
export function getArticleById(id: string) {
  return requests.get('/articles/' + id)
}

/**
 * 获取喜爱数排行榜
 * @param num 返回前几的语句
 */
export function getLikesRanking(num: number = 10) {
  return requests.get('/articles', { params: { pp: num, sort: ArticleSortType.LIKES, direction: ArticleSortDirection.DESC } })
}

/**
 * 检查语句是否被用户喜爱（若无token则通过ip判断）
 * @param id 语句id
 * @param token 
 */
export function isLiked(id: string, token: string = "") {
  return requests.get(`/articles/${id}/liked`, getTokenConfig(token))
}

/**
 * 喜爱一个语句
 * @param id 语句id
 * @param token 
 */
export function likeArticle(id: string, token: string = "") {
  return requests.put(`/articles/${id}/liked`, {}, getTokenConfig(token))
}

/**
 * 取消喜爱一个语句
 * @param id 语句id
 * @param token 
 */
export function unlikeArticle(id: string, token: string = "") {
  return requests.delete(`/articles/${id}/liked`, getTokenConfig(token))
}

/**
 * 上传语句
 * @param body 
 * @param token access token
 */
export function uploadArticle(body: IAPIUploadParams, token: string = "") {
  return requests.post('/articles', body, getTokenConfig(token))
}

/**
 * 搜索语句
 * @param body 
 */
export function searchArticles(body: IAPISearchParams) {
  return requests.post('/articles/search', body)
}

/**
 * 获取用户信息
 * 若获取不到用户信息且token合法则创建新用户
 * @param id 用户id
 * @param token access token
 */
export function getUserProfile(id: string, token: string = "") {
  return requests.get(`/users/${id}/profile`, getTokenConfig(token))
}

/**
 * 修改用户信息
 * @param id 用户id
 * @param patchFields 修改的部分（头像、名字）
 * @param token access token
 */
export function patchUserProfile(id: string, patchFields: IAPIPatchUserProfile, token: string) {
  return requests.patch(`/users/${id}/profile`, patchFields, getTokenConfig(token))
}

/**
 * 获取用户上传的语句
 * @param id 用户id
 */
export function getUserUploads(id: string, pp: number = 10, pn: number = 1) {
  return requests.get(`/users/${id}/uploads?pp=${pp}&pn=${pn}`)
}

/**
 * 获取用户喜爱的语句
 * @param id 用户id
 */
export function getUserLikes(id: string, pp: number = 10, pn: number = 1) {
  return requests.get(`/users/${id}/likes?pp=${pp}&pn=${pn}`)
}

/**
 * 删除语句
 * @param id 语句id
 * @param token access token
 */
export function deleteArticle(id: string, token: string) {
  return requests.delete(`/articles/${id}`, getTokenConfig(token))
}

/**
 * 获取评论
 * @param aid 语句id
 */
export function getComments(aid: string, pp: number = 10, pn: number = 1) {
  return requests.get(`/articles/${aid}/comments?pp=${pp}&pn=${pn}`)
}

/**
 * 发表评论
 * @param aid 语句id
 */
export function createComment(aid: string, content: string, token: string) {
  return requests.post(`/articles/${aid}/comments`, { content }, getTokenConfig(token))
}

/**
 * 删除评论
 * @param aid 语句id
 * @param cid 评论id
 */
export function deleteComment(aid: string, cid: string, token: string) {
  return requests.delete(`/articles/${aid}/comments/${cid}`, getTokenConfig(token))
}
