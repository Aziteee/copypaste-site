import { type IAPIQueryParams, type IAPIUploadParams, ArticleSortType, ArticleSortDirection, IAPISearchParams, IAPIPatchUserProfile } from "@/types"
import requests from "./request"

export function getRandomArticle() {
  return requests.get('/articles', { params: { pp: 1, sort: ArticleSortType.RANDOM } })
}

export function getSearchResults(params: IAPIQueryParams) {
  return requests.get('/articles', { params })
}

export function getArticleById(id: string) {
  return requests.get('/articles/' + id)
}

export function getLikesRanking(num: number = 10) {
  return requests.get('/articles', { params: { pp: num, sort: ArticleSortType.LIKES, direction: ArticleSortDirection.DESC } })
}

export function isLiked(id: string, token: string = "") {
  return requests.get(`/articles/${id}/liked`, { headers: { Authorization: "Bearer " + token }})
}

export function likeArticle(id: string, token: string = "") {
  return requests.put(`/articles/${id}/liked`, {}, { headers: { Authorization: "Bearer " + token }})
}

export function unlikeArticle(id: string, token: string = "") {
  return requests.delete(`/articles/${id}/liked`, { headers: { Authorization: "Bearer " + token }})
}

export function uploadArticle(body: IAPIUploadParams, token: string = "") {
  return requests.post('/articles', body, { headers: { Authorization: "Bearer " + token }})
}

export function searchArticles(body: IAPISearchParams) {
  return requests.post('/articles/search', body)
}

export function getUserProfile(id: string, token: string = "") {
  return requests.get(`/users/${id}/profile`, { headers: { Authorization: "Bearer " + token }})
}

export function patchUserProfile(id: string, patchFields: IAPIPatchUserProfile, token: string) {
  return requests.patch(`/users/${id}/profile`, patchFields, { headers: { Authorization: "Bearer " + token }})
}

export function getUserUploads(id: string) {
  return requests.get(`/users/${id}/uploads`)
}

export function getUserLikes(id: string) {
  return requests.get(`/users/${id}/likes`)
}
