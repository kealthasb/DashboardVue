import request from '@/utils/request'
import { IGameData, IPlatformData } from './types'

export const defaultPlatformData: IPlatformData = {
  id: 0,
  name: ''
}

export const getPlatforms = (params: any) =>
  request({
    url: '/platforms/list',
    method: 'get',
    params
  })

export const getPlatform = (id: number) =>
  request({
    url: `/platforms/${id}`,
    method: 'get'
  })

export const addPlatform = (data: any) =>
  request({
    url: '/platforms/add',
    method: 'post',
    data
  })

export const updatePlatform = (data: any) =>
  request({
    url: `/platforms/update`,
    method: 'post',
    data
  })

export const deletePlatform = (data: Array<number>) =>
  request({
    url: `/platforms/delete`,
    method: 'post',
    data: data
  })
