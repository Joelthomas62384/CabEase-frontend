"use client"
import { store } from "@/Redux/store";
// import { useAuth } from "@/context";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getCookie,removeCookie, setCookie } from "typescript-cookie";



const apiUrl = process.env.NEXT_PUBLIC_API_URL 
const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  timeout : 15000,
});

// const {userLoggedIn} = useAuth()
let isRefreshing = false;

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const tokenExpiry:Number = Number(getCookie("expiry"));
      const currentTime:Number = Math.floor(Date.now() / 1000);

      if ( tokenExpiry && currentTime > tokenExpiry) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
         
            const response:any = await axios.post(`${apiUrl}user/refresh_token`, {}, { withCredentials: true });
          
           
          } catch (error) {
            console.error("Token refresh failed. Logging out user.");
            throw new Error("Logout")

           
          } finally {
            isRefreshing = false;
          }
        } else {
          console.log("Token refresh already in progress, waiting...");
        }
      }

      return config;
    } catch (error) {
 
      console.error("Request Interceptor Error:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default axiosInstance;