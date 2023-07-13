import { AuthBindings } from "@refinedev/core";
import axios, { AxiosRequestConfig } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

export const axiosInstance = axios.create();

axiosInstance.interceptors.response.use((request: AxiosRequestConfig) => {
    const token = JSON.parse(localStorage.getItem("auth") || "{}");

    if (request.headers) {
        request.headers["Authorization"] = `Bearer ${token}`;
    } else {
        request.headers = {
            Authorization: `Bearer ${token}`,
        };
    }

    return request;
});

const refreshAuthLogic = (failedRequest: any) =>
    axiosInstance
        .post("/auth/token/refresh")
        .then((tokenRefreshResponse) => {
            localStorage.setItem("auth", tokenRefreshResponse.data.token);

            failedRequest.response.config.headers[
                "Authorization"
            ] = `Bearer ${tokenRefreshResponse.data.token}`;

            return Promise.resolve();
        })
        .catch((err) => {
            localStorage.removeItem("auth");
            return Promise.reject(err);
        });

createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic);

const mockUsers = [
    { email: "john@mail.com", roles: ["admin"] },
    { email: "jane@mail.com", roles: ["editor"] },
];

const authProvider: AuthBindings = {
    login: async ({ email, password }) => {
        const user = mockUsers.find((user) => user.email === email);

        if (user) {
            localStorage.setItem("auth", JSON.stringify(user));
            return {
                success: true,
                redirectTo: "/",
            };
        }

        return {
            success: false,
            redirectTo: "/register",
            error: {
                message: "Invalid credentials",
                name: "Invalid email or password",
            },
        };
    },

    check: async () => {
        const user = localStorage.getItem("auth");

        if (user) {
            return { authenticated: true };
        }

        return {
            authenticated: false,
            logout: true,
            redirectTo: "/login",
            error: {
                message: "Check failed",
                name: "Unauthorized",
            },
        };
    },

    logout: async () => {
        localStorage.removeItem("auth");
        return {
            success: true,
            redirectTo: "/login",
        };
    },

    onError: async (error) => {
        if (error.status === 401 || error.status === 403) {
            return {
                logout: true,
                redirectTo: "/login",
                error,
            };
        }

        return {};
    },

    register: async ({ email, password }) => {
        const user = mockUsers.find((user) => user.email === email);

        if (user) {
            return {
                success: false,
                error: {
                    message: "Register error",
                    name: "User already exists",
                },
            };
        }

        mockUsers.push({ email, roles: ["editor"] });

        return {
            success: true,
            redirectTo: "/login",
        };
    },

    getPermissions: () => {
        const user = localStorage.getItem("auth");

        if (user) {
            const { roles } = JSON.parse(user);

            return roles;
        }

        return null;
    },

    getIdentity: async () => {
        const user = localStorage.getItem("auth");

        if (user) {
            const { email, roles } = JSON.parse(user);

            return {
                email,
                roles,
                name: "John Doe",
                avatar: "https://i.pravatar.cc/300",
            };
        }

        return null;
    },

    forgotPassword: async ({ email }) => {
        return {
            success: false,
            error: {
                message: "Forgot password error",
                name: "Email address does not exist",
            },
        };
    },

    updatePassword: async ({ password }) => {
        return {
            success: false,
            error: {
                message: "Update password error",
                name: "Invalid password",
            },
        };
    },
};

export default authProvider;
