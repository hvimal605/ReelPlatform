import { toast } from "react-hot-toast"

import { setLoading } from "../../slices/authSlice"

import { apiConnector } from "../apiConnector"
import { reelsEndpoints } from "../apis"




const {
  UPLOAD_REEL_API,
  GET_REELS_FEED_API,
  DELETE_REEL_API,
  GET_REEL_BY_ID_API,
  EDIT_REEL_API,
  GET_REEL_COMMENTS_API,
  LIKE_REEL_API,
  DISLIKE_REEL_API,
  SHARE_REEL_API,
  GET_ENAGAGEMENT_API,
  GET_REELS_OF_CREATOR_API 

} = reelsEndpoints

export function uploadReel(ReelData, token, username, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Uploading Reel...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("POST", UPLOAD_REEL_API, ReelData, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      })

      console.log("UPLOAD REEL RESPONSE >>>", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Reel Uploaded Successfully")
      navigate(`/${username}`)
    } catch (error) {
      console.error("UPLOAD REEL ERROR >>>", error)
      toast.error("Reel Upload Failed")
    }

    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}


export function getReelsFeed(category) {
  return async (dispatch) => {
    const toastId = toast.loading('Fetching Reels...');
    dispatch(setLoading(true));

    try {


      const response = await apiConnector('POST', GET_REELS_FEED_API, category);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const reels = response.data.reels;
      toast.success('Reels Fetched');
      return reels; // You can also dispatch to a store here
    } catch (error) {
      console.error('GET REELS FEED ERROR >>>', error);
      toast.error('Failed to fetch reels');
      return [];
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}




export const deleteReel = async (reelId, token) => {
  const toastId = toast.loading("Deleting Reel...");
  try {
    const response = await apiConnector("DELETE", DELETE_REEL_API, reelId, {
      Authorization: `Bearer ${token}`,
    });

    console.log("DELETE REEL API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could not delete reel");
    }

    toast.success("Reel Deleted Successfully");
    return true;
  } catch (error) {
    console.log("DELETE REEL API ERROR............", error);
    toast.error(error?.response?.data?.message || "Reel Deletion Failed");
    return false;
  } finally {
    toast.dismiss(toastId);
  }
};



export const getReelDetailsById = async (reelId) => {

  try {
    const response = await apiConnector("POST", GET_REEL_BY_ID_API, { reelId });
    return response.data.reel;
  } catch (error) {
    toast.error("Failed to fetch reel data");
    console.error("GET_REEL_BY_ID_ERROR:", error);
    return null;
  }
};


export const editReelDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Updating Reel...");

  try {
    const response = await apiConnector("PUT", EDIT_REEL_API, data, {

      Authorization: `Bearer ${token}`,
    });

    console.log("EDIT REEL RESPONSE >>>", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not update reel");
    }

    toast.success("Reel updated successfully");
    result = response?.data?.reel;
  } catch (error) {
    console.error("EDIT REEL ERROR >>>", error);
    toast.error(error.message || "Failed to update reel");
  }

  toast.dismiss(toastId);
  return result;
};



export const getReelComments = async (reelId, token) => {
  const toastId = toast.loading("Loading comments...");
  let result = null;

  try {
    const response = await apiConnector(
      "POST",
      GET_REEL_COMMENTS_API,
      { reelId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("GET_REEL_COMMENTS API RESPONSE >>>", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    result = response.data.comments;
  } catch (error) {
    console.error("GET_REEL_COMMENTS API ERROR >>>", error);
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Failed to load comments");
    }
    result = null;
  }

  toast.dismiss(toastId);
  return result;
};


export const likeReel = async (reelId, token) => {
  try {
    const response = await apiConnector("POST", LIKE_REEL_API, { reelId }, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("Error in likeReel API:", error);
    return null;
  }
};


export const dislikeReel = async (reelId, token) => {
  try {
    const response = await apiConnector("POST", DISLIKE_REEL_API, { reelId }, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("Error in DislikeReel API:", error);
    return null;
  }
};


export const shareReel = async (reelId) => {
  try {
    const response = await apiConnector(
      'POST',
      SHARE_REEL_API,
      { reelId },

    );

    const data = response.data;

    if (!data || !data.message || data.shareCount === undefined) {
      throw new Error(data?.message || 'Failed to share reel');
    }

    return {
      success: true,
      message: data.message,
      shareCount: data.shareCount,
    };
  } catch (error) {
    console.error('Error in shareReel API:', error);
    return {
      success: false,
      message: error.message || 'Something went wrong',
    };
  }
};


export const getReelEngagement = async (reelId) => {
  try {
    const response = await apiConnector('POST',GET_ENAGAGEMENT_API ,{reelId} );
    return response.data.data; 
  } catch (error) {
    console.error('Error fetching reel engagement:', error);
    return null;
  }
};


export const getReelsByUsername = async (username) => {
  try {
    const response = await apiConnector("POST",  GET_REELS_OF_CREATOR_API , {username} );
    return response.data.reels;
  } catch (error) {
    console.error("Failed to fetch reels by username", error);
    return [];
  }
};