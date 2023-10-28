import { type IAPIQueryParams, type IAPIUploadParams, ArticleSortType, ArticleSortDirection, IAPISearchParams } from "@/types"
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

export function isLiked(id: string) {
  return requests.get(`/articles/${id}/liked`)
}

export function likeArticle(id: string) {
  return requests.put(`/articles/${id}/liked`)
}

export function unlikeArticle(id: string) {
  return requests.delete(`/articles/${id}/liked`)
}

export function uploadArticle(body: IAPIUploadParams) {
  return requests.post('/articles', body)
}

export function searchArticles(body: IAPISearchParams) {
  return requests.post('/articles/search', body)
}
