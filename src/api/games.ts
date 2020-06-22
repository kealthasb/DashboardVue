import request from '@/utils/request'
import { IGameData } from './types'

export const defaultGameData: IGameData = {
  id: 0,
  name: '',
  appId: '',
  platform: '',
  packageName: ''
}

export const getGames = (params: any) =>
  request({
    url: '/games/list',
    method: 'get',
    params
  })

export const getGame = (id: number) =>
  request({
    url: `/games/${id}`,
    method: 'get'
  })

export const addGame = (data: any) =>
  request({
    url: '/games/add',
    method: 'post',
    data
  })

export const updateGame = (data: any) =>
  request({
    url: `/games/update`,
    method: 'post',
    data
  })

export const deleteGame = (data: Array<number>) =>
  request({
    url: `/games/delete`,
    method: 'post',
    data: data
  })
