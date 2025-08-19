import { CommonHelper } from '../helpers/CommonHelper';
import axios from 'axios';

const APIURL = import.meta.env.VITE_API_URL;

export abstract class CommonService {
    private static setHeaders() {
        const userData = CommonHelper.GetUserData();
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData?.api_token ?? ""}`;
        axios.defaults.headers.common['Ip'] = userData?.Ip ?? "";
    }

    private static handleResponse(_resolve: Function, reject: Function, error: any) {
        console.error(error);
        reject({});
    }

    public static GetAll<T = any>(UrlName: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios.get(`${APIURL}${UrlName}`)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static GetById<T = any>(id: number | string, UrlName: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios.get(`${APIURL}${UrlName}/${id}`)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static CommonPost<T = any>(model: any, UrlName: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios.post(`${APIURL}${UrlName}`, model)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static Delete<T = any>(id: string, UrlName: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios.delete(`${APIURL}${UrlName}/${id}`)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static PostWithParameter<T = any>(model: any, UrlName: string, params: any): Promise<T> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            let url = `${APIURL}${UrlName}`;
            params.forEach((e: any) => {
                url = `${url}/${e.params}`;
            });
            axios.post(url, model)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static GetWithParameter<T = any>(UrlName: string, params: any): Promise<T> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            let url = `${APIURL}${UrlName}`;
            params.forEach((e: any) => {
                url = `${url}/${e.params}`;
            });
            axios.get(url)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static FullUrlGet<T = any>(UrlName: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios.get(UrlName)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static CommonPatch<T = any>(UrlName: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios.patch(`${APIURL}${UrlName}`)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static CommonPut<T = any>(model: any, UrlName: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios.put(`${APIURL}${UrlName}`, model)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static CommonDelete<T = any>(UrlName: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios.delete(`${APIURL}${UrlName}`)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static ExcelDownloadGet(UrlName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios.get(`${APIURL}${UrlName}`, { responseType: 'blob' })
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static async DownloadPost(model: any, UrlName: string): Promise<any> {
        try {
            const response = await axios.post(`${APIURL}/${UrlName}`, model, {
                responseType: "blob",
            });
            return response;
        } catch (error) {
            console.error("DownloadPost Error:", error);
            throw error;
        }
    }

    public static async DownloadGet(id: any, UrlName: string): Promise<Blob> {
        try {
            const response = await axios.get(`${APIURL}${UrlName}/${id}`, {
                responseType: "blob",
            });
            return response.data;
        } catch (error) {
            console.error("DownloadGet Error:", error);
            throw error;
        }
    }
}