export interface KakaoServerResponse {
    data: KakaoServerData
}

export interface KakaoServerData {
    access_token: string
}

export interface KakaoServerUserData {
    email: string
}
