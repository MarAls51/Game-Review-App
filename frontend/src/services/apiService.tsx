import { sanitizeInput } from "@/components/Sanitizer";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchTldrData = async (appid: string, name: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/generalReview`,
      {
        params: { appid, name },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch TLDR data", error);
    return error;
  }
};

export const fetchPersonalizedReview = async (sub: string, name: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/personalizedReview`,
      {
        params: { sub, name },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch personalized review", error);
    return error;
  }
};

export const fetchTestimonials = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/user-testimonials`);
    return response.data;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return error;
  }
};


export const fetchSteamChartData = async (appid: number, name: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/steam-charts`, {
      params: {
        appid,
        name,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching stat data:", error);
    return error; 
  }
};

export const fetchUser = async (sub: string | undefined) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/user?sub=${sub}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      try {
        await axios.post(`${API_BASE_URL}/api/user`, { sub, alias: "Anonymous" });
        return { alias: "Anonymous" };
      } catch (postError) {
        console.error("Failed to create user:", postError);
      }
    } else {
      console.error("Failed to fetch user data:", error);
    }
    return error;
  }
};

export const updateUser = async (sub: string | undefined, data: any) => {
  try {
    await axios.put(`${API_BASE_URL}/api/user`, { sub, ...data });
  } catch (error) {
    console.error("Failed to update user data:", error);
  }
};

export const deleteUser = async (sub: string | undefined) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/user`, { data: { sub } });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return error;
  }
};

export const validateXboxGamertag = async (sub: string | undefined, gamerTag: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/validate-xbox-gamertag`, {
      params: { sub, gamerTag },
    });
    return response.data.isValid;
  } catch (error) {
    console.error("Error validating Xbox Gamer Tag:", error);
    return error;
  }
};

export const createUser = async (sub: string | undefined) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user`,
        {
          sub: sub,
          alias: "Anonymous",
        },);
      return response.data.isValid;
    } catch (error) {
      console.error("Error validating Xbox Gamer Tag:", error);
      return error;
    }
  };

export const steamRedirect = (sub: string | undefined) => {
    return `${API_BASE_URL}/api/login?sub=${sub}`
}

export const fetchAuthConfig = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth-config`);
    if (!response.ok) throw new Error("Failed to fetch auth config");
    return response.json();
  } catch (error) {
    console.error("Auth config error:", error);
    return null;
  }
};
