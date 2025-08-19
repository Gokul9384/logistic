// src/helpers/CommonHelper.ts
import { Notify, Loading } from 'quasar';

abstract class CommonHelper {
    // Validation Logic
    public static FormValidation(ValidationArray: any, data: any): { isValid: boolean, errors: any } {
        const errors = this.Validation(ValidationArray, data);
        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }
    
    private static Validation(initialValues: any, data: any) {
        let errors: any = {};
        for (const iterator of initialValues) {
            for (const iteratorvalidation of iterator.validation) {
                if (iteratorvalidation.type === "required") {
                    if (!data[iterator.name]) {
                        errors[iterator.name] = iteratorvalidation.message;
                        break;
                    }
                }
                if (iteratorvalidation.type === "email") {
                    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data[iterator.name])) {
                        errors[iterator.name] = iteratorvalidation.message;
                        break;
                    }
                }
                if (iteratorvalidation.type === "min") {
                    if (parseFloat(data[iterator.name]) < parseFloat(iteratorvalidation.minvalue)) {
                        errors[iterator.name] = iteratorvalidation.message;
                        break;
                    }
                }
                if (iteratorvalidation.type === "max") {
                    if (data[iterator.name] > iteratorvalidation.maxvalue) {
                        errors[iterator.name] = iteratorvalidation.message;
                        break;
                    }
                }
                if (iteratorvalidation.type === "password") {
                    if (data[iterator.name].length < 8) {
                        errors[iterator.name] = "Your password must be at least 8 characters";
                        break;
                    }
                    if (data[iterator.name].search(/[A-Z]/) < 0) {
                        errors[iterator.name] = "Your password must contain at least one uppercase letter.";
                        break;
                    }
                    if (data[iterator.name].search(/[a-z]/i) < 0) {
                        errors[iterator.name] = "Your password must contain at least one lowercase letter.";
                        break;
                    }
                    if (data[iterator.name].search(/[0-9]/) < 0) {
                        errors[iterator.name] = "Your password must contain at least one digit.";
                        break;
                    }
                    if (data[iterator.name].search(/[!@#$%^&*]/) < 0) {
                        errors[iterator.name] = "Your password must contain at least one special character (!@#$%^&*).";
                        break;
                    }
                }
            }
        }
        return errors;
    }
    
    // Localstorage
    static UserData: any;
    static UserStorageName: string = "user_data";
    
    public static SetLocalStorage(name: string, value: any, IsUserData: boolean = false, JsonFormat: boolean = true) {
        if (IsUserData) {
            if (JsonFormat) {
                localStorage.setItem(this.UserStorageName, JSON.stringify(value));
            } else {
                localStorage.setItem(this.UserStorageName, value);
            }
            this.UserData = null;
        } else {
            if (JsonFormat) {
                localStorage.setItem(name, JSON.stringify(value));
            } else {
                localStorage.setItem(name, value);
            }
        }
    }
    
    public static GetLocalStorage(name: string, JsonFormat: boolean = true) {
        if (JsonFormat) {
            return JSON.parse(localStorage.getItem(name) ?? "{}");
        } else {
            return localStorage.getItem(name) ?? "";
        }
    }
    
    public static GetUserData() {
        if (!this.UserData) {
            const LocalUserData = this.GetLocalStorage(this.UserStorageName);
            this.UserData = LocalUserData;
        }
        return this.UserData;
    }
    
    public static ClearLocalStorage() {
        localStorage.clear();
    }
    
    // Add these methods to fix the errors
    public static SetUserData(userData: any) {
        this.SetLocalStorage(this.UserStorageName, userData, true);
    }
    
    public static ClearUserData() {
        this.ClearLocalStorage();
    }
    
    public static ExceldownloadAsBlob(response: any, view: boolean = false, filename: string = "") {
        try {
            const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);
            const objectUrl = window.URL.createObjectURL(blob);
            if (view) {
                window.open(objectUrl, '_blank');
            } else {
                const link = document.createElement('a');
                link.href = objectUrl;
                const contentDisposition = response.headers?.['content-disposition'] || response.headers?.get('content-disposition');
                let extractedFilename = "download.xlsx";
                if (contentDisposition) {
                    const matches = contentDisposition.match(/filename\*?=['"]?(?:UTF-8['"]*)?([^;\n]*)/i);
                    if (matches && matches[1]) {
                        extractedFilename = decodeURIComponent(matches[1]);
                    }
                }
                link.download = filename || extractedFilename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            window.URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error("Error handling file download:", error);
        }
    }
    
    public static SuccessToaster = (msg = '') => {
        Notify.create({
            type: 'positive',
            message: msg,
            position: 'top-right',
            timeout: 3000,
            actions: [{
                icon: 'close',
                color: 'white',
                round: true,
            }]
        });
    };
    
    public static ErrorToaster = (msg = '') => {
        Notify.create({
            type: 'negative',
            message: msg,
            position: 'top-right',
            timeout: 3000,
            actions: [{
                icon: 'close',
                color: 'white',
                round: true,
            }]
        });
    };
    
    public static Showspinner = () => {
        Loading.show({
            message: 'Loading...'
        });
    };
    
    public static Hidespinner = () => {
        Loading.hide();
    };
    
    public static async PdfDownloadAsBlob(response: any, view: boolean = false, filename: string = "") {
        try {
            const blob = response instanceof Blob ? response : await response.blob();
            const objectUrl = window.URL.createObjectURL(blob);
            if (view) {
                window.open(objectUrl, '_blank');
            } else {
                const link = document.createElement('a');
                link.href = objectUrl;
                const contentDisposition = response.headers?.get
                    ? response.headers.get('content-disposition')
                    : response.headers?.['content-disposition'];
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = contentDisposition ? filenameRegex.exec(contentDisposition) : null;
                if (matches && matches[1]) {
                    link.download = matches[1].replace(/['"]/g, '');
                } else if (filename) {
                    link.download = filename;
                } else {
                    link.download = 'download.pdf';
                }
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            window.URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error("Error handling file download:", error);
        }
    }
    
    public static downloadAsBlob(response: any, fileName: any) {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(response);
        link.download = fileName;
        link.click();
    }
}

export { CommonHelper };