import { setLoading, setUser } from "../../slices/profileSlice"
import { profileEndpoints } from "../apis"
import { logout } from "./authApi"


import { apiConnector } from "../apiConnector"
import { toast } from "react-hot-toast"
const { GET_PROFILE_BY_USERNAME, UPDATE_PROFILE_API,UPDATE_DISPLAY_PICTURE_API,ADD_COMMENT_API } = profileEndpoints

export function getUserDetails(username, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", GET_PROFILE_BY_USERNAME, { username });
      // console.log("GET_USER_DETAILS API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.dismiss(toastId);
      dispatch(setLoading(false));
      return response.data;
    } catch (error) {
      console.log("GET_USER_DETAILS API ERROR............", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}


export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating profile...");
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });

      console.log("UPDATE_PROFILE_API RESPONSE >>>", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const updatedUser = response.data.updatedUserDetails
      console.log("Updated User Details >>>", updatedUser);

      // Fallback avatar (in case updatedUser.profileImage is not provided)
      const userImage = updatedUser.profileImage
        ? updatedUser.profileImage
        : `https://api.dicebear.com/5.x/initials/svg?seed=${updatedUser.username}`;

      dispatch(
        setUser({
          ...updatedUser,
          profileImage: userImage,
        })
      );

      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.error("UPDATE_PROFILE_API ERROR >>>", error);
      toast.error("Could not update profile");
    } finally {
      toast.dismiss(toastId);
    }
  };
}


export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")

    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )
      console.log(
        "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
        response
      )

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Display Picture Updated Successfully")
      dispatch(setUser(response.data.data))
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)

      toast.error("Could Not Update Display Picture")
    }
    toast.dismiss(toastId)
  }
}


export const addComment = async (reelId, text, token) => {
  try {
    const response = await apiConnector(
      'POST',
      ADD_COMMENT_API,
      { reelId, text },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error(response.data.message || 'Failed to add comment');
    }

    return response.data.comment;
  } catch (error) {
    console.error('ADD_COMMENT_API ERROR =>', error);
    return null;
  }
};