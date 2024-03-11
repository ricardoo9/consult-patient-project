import type { CodeType, Patient, PatientList, User, UserInfo } from '@/types/user'
import { request } from '@/utils/request'
// 用户相关的一些请求函数
// 密码登录api
export const loginByPassword = (mobile: string, password: string) =>
  request<User>('login/password', 'POST', { mobile, password })
// 发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) => {
  request('code', 'GET', { mobile, type })
}
// 短信登录api
export const loginByMobile = (mobile: string, code: string) => {
  request<User>('login', 'POST', { mobile, code })
}
// 请求用户信息api
export const getUserInfo = () => request<UserInfo>('patient/myUser')
// 获取用户档案信息
export const getPatientList = () => request<PatientList>('patient/mylist')
// 添加患者
export const addPatient = (patient: Patient) => request('patient/add', 'POST', patient)
// 编辑患者
export const editPatient = (patient: Patient) => request('patient/update', 'PUT', patient)
// 删除患者
export const delPatient = (id: string) => request(`patient/del/${id}`, 'DELETE')
// 获取患者信息
export const getPatientDetail = (id: string) => request<Patient>(`patient/info/${id}`)
// 请求消息条数
export const getUnreadMessageCount = () => {
  return request<number>('patient/message/unRead/all')
}
