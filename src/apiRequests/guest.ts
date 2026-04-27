import http from '@/lib/http'
import {
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType
} from '@/schemaValidations/auth.schema'
import {
  GuestCreateOrdersBodyType,
  GuestCreateOrdersResType,
  GuestGetOrdersResType,
  GuestLoginBodyType,
  GuestLoginResType
} from '@/schemaValidations/guest.schema'

const guestApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number
    payload: RefreshTokenResType
  }> | null,
  sLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>('/guest/auth/login', body),
  login: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>('/api/guest/auth/login', body, {
      baseUrl: ''
    }),
 
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>('/guest/auth/refresh-token', body),
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      '/api/guest/auth/refresh-token',
      null,
      {
        baseUrl: ''
      }
    )
    const result = await this.refreshTokenRequest
    this.refreshTokenRequest = null
    return result
  },
  order: (body: GuestCreateOrdersBodyType) =>
    http.post<GuestCreateOrdersResType>('/guest/orders', body),
  getOrderList: () => http.get<GuestGetOrdersResType>('/guest/orders')
}

export default guestApiRequest
