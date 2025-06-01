

const BASE_URL = 'http://localhost:4000/api/v1'


// AUTH ENDPOINTS
export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}

export const reelsEndpoints = {
    UPLOAD_REEL_API: BASE_URL + "/reel/uploadReel",
    GET_REELS_FEED_API: BASE_URL + "/reel/feed",

    DELETE_REEL_API: BASE_URL + "/reel/deleteReel",
    GET_REEL_BY_ID_API: BASE_URL + "/reel/getSingleReel",
    EDIT_REEL_API: BASE_URL + "/reel/editReel",
    GET_REEL_COMMENTS_API: BASE_URL + "/comment/getallComment",
    LIKE_REEL_API: BASE_URL + "/interaction/like",
    DISLIKE_REEL_API: BASE_URL + "/interaction/dislike",
    SHARE_REEL_API: BASE_URL + "/interaction/share",
    GET_ENAGAGEMENT_API: BASE_URL + "/interaction/getEnagement",
    GET_REELS_OF_CREATOR_API : BASE_URL + "/reel/reelsBycreator",
}


export const profileEndpoints = {
    GET_PROFILE_BY_USERNAME: BASE_URL + "/profile/getProfile",
    UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
    UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
    ADD_COMMENT_API: BASE_URL + "/comment/addComment",

}