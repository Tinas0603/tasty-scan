import http from "@/lib/http";
import {
    AccountResType,
    ChangePasswordBodyType,
    ChangePasswordV2BodyType,
    ChangePasswordV2ResType,
    UpdateMeBodyType
} from "@/schemaValidations/account.schema";

const prefix = '/accounts'
const accountApiRequest = {
    me: () => http.get<AccountResType>('/accounts/me'),
    sMe: (accessToken: string) =>
        http.get<AccountResType>(`${prefix}/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }),
    updateMe: (body: UpdateMeBodyType) =>
        http.put<AccountResType>('/accounts/me', body),
    // đổi mật khẩu
    changePassword: (body: ChangePasswordBodyType) =>
        http.put<AccountResType>('/accounts/change-password', body),
    // đổi mật khẩu và cập nhật lại accessToken vì giả sử nhiều người dùng chung 1 tài khoản
    // nếu 1 tài khoản đổi mật khẩu thì những người dùng khác cũng sẽ bị logout để không thể 
    // sử dụng token cũ mà tiếp tục sử dụng
    changePasswordV2: (body: ChangePasswordV2BodyType) =>
        http.put<ChangePasswordV2ResType>(
            `/api${prefix}/change-password-v2`,
            body,
            {
                baseUrl: ''
            }
        ),
    sChangePasswordV2: (accessToken: string, body: ChangePasswordV2BodyType) =>
        http.put<ChangePasswordV2ResType>(`${prefix}/change-password-v2`, body, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }),
}

export default accountApiRequest