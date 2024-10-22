import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";
import http from "@/lib/http";
const authApiRequest = {
    sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
    login: (body: LoginBodyType) => http.post<LoginResType>('/api/auth/login', body, {
        baseUrl: ''
    }),
}

export default authApiRequest