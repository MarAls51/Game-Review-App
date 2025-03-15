import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const fetchTldrData = async (appid: string, name: string) => {
  try {
    const response = await api.get("/api/generalReview", {
      params: { appid, name },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch TLDR data", error);
    return error;
  }
};

export const fetchPersonalizedReview = async (sub: string, name: string) => {
  try {
    const response = await api.get("/api/personalizedReview", {
      params: { sub, name },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch personalized review", error);
    return error;
  }
};

export const fetchTestimonials = async () => {
  try {
    const response = await api.get("/api/user-testimonials");
    return response.data;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return error;
  }
};

export const fetchSteamChartData = async (appid: number, name: string) => {
  try {
    const response = await api.get("/api/steam-charts", {
      params: {
        appid,
        name,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching stat data:", error);
    return 0;
  }
};

export const fetchUser = async (sub: string | undefined) => {
  try {
    const response = await api.get(`/api/user?sub=${sub}`);
    return response.data;
  } catch (error) {
    return 0;
  }
};

export const updateUser = async (sub: string | undefined, data: any) => {
  try {
    await api.put("/api/user", { sub, ...data });
  } catch (error) {
    console.error("Failed to update user data:", error);
  }
};

export const deleteUser = async (sub: string | undefined) => {
  try {
    await api.delete("/api/user", { data: { sub } });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return error;
  }
};

export const validateXboxGamertag = async (sub: string | undefined, gamerTag: string) => {
  try {
    const response = await api.get("/api/validate-xbox-gamertag", {
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
    const response = await axios.post(`${API_BASE_URL}/api/user`,
      {
        sub: sub,
        alias: "Anonymous",
      },);
    return response.data.isValid;
  } catch (error) {
    console.error("Error creating user:", error);
    return error;
  }
};

export const steamRedirect = (sub: string | undefined) => {
  return `${API_BASE_URL}/api/login?sub=${sub}`;
};

export const fetchAuthConfig = async () => {
  try {
    const response = await api.get("/api/auth-config");
    return response.data;
  } catch (error) {
    console.error("Auth config error:", error);
    return null;
  }
};

export const authLogout = async () => {
  try {
    const response = await api.get("/api/auth-logout");
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    return null;
  }
};