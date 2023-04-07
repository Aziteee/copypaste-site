import { type IAPIQueryParams, type IAPIUploadParams, ArticleSortType, ArticleSortDirection } from "@/types"
import requests from "./request"

function getRandomArticle() {
  return requests.get('/articles', { params: { pp: 1, sort: ArticleSortType.RANDOM } })
}

function getSearchResults(params: IAPIQueryParams) {
  return requests.get('/articles', { params })
}

function getArticleById(id: string) {
  return requests.get('/articles/' + id)
}

function getLikesRanking(num: number = 10) {
  return requests.get('/articles', { params: { pp: num, sort: ArticleSortType.LIKES, direction: ArticleSortDirection.DESC } })
}

function isLiked(id: string) {
  return requests.get(`/articles/${id}/liked`)
}

function likeArticle(id: string) {
  return requests.put(`/articles/${id}/liked`)
}

function unlikeArticle(id: string) {
  return requests.delete(`/articles/${id}/liked`)
}

function uploadArticle(body: IAPIUploadParams) {
  return requests.post('/articles', body)
}

export default {
  getRandomArticle,
  getSearchResults,
  getArticleById,
  getLikesRanking,
  isLiked,
  uploadArticle,
  likeArticle,
  unlikeArticle
}
