import { Contents } from "src/api/content/entities/content.entity";
import { Users } from "src/api/user/entities/user.entity";
import { Favorites } from "./favorite.entity";
import { Chats } from "src/events/chat/entities/chat.entity";

export interface KakaoServerResponse {
  data: KakaoServerData;
}

export interface KakaoServerData {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

export interface KakaoServerUserData {
  id: number;
  connected_at: Date;
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile_nickname_needs_agreement: boolean;
    profile_image_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
    };
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email: string;
    has_gender: boolean;
    gender_needs_agreement: boolean;
  };
}

export interface JwtdecodedUser {
  user: Users;
}

export interface ContentList {
  totalPage: number;
  content_list: Contents[];
}

export interface ChatList {
  totalPage: number;
  chat_list: Chats[];
}

export interface FavoriteList {
  totalPage: number;
  favorite_list: Favorites[];
}
