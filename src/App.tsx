import { Refine, Authenticated } from "@refinedev/core";
import {
    ThemedLayoutV2,
    ErrorComponent,
    RefineThemes,
    RefineSnackbarProvider,
    notificationProvider,
} from "@refinedev/mui";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import routerBindings, {
    CatchAllNavigate,
    NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import authProvider, { axiosInstance } from "authProvider";
import { dataProvider } from "rest-data-provider";
import { BlogPostList } from "pages/blog-posts/list";
import { BlogPostShow } from "pages/blog-posts/show";
import { BlogPostEdit } from "pages/blog-posts/edit";
import { BlogPostCreate } from "pages/blog-posts/create";
import {
    ForgotPasswordPage,
    LoginPage,
    RegisterPage,
    UpdatePasswordPage,
} from "components/pages/auth/components";

const App: React.FC = () => {
    return (
        <ThemeProvider theme={RefineThemes.Blue}>
            <CssBaseline />
            <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
            <RefineSnackbarProvider>
                <BrowserRouter>
                    <Refine
                        routerProvider={routerBindings}
                        authProvider={authProvider}
                        dataProvider={dataProvider(
                            "https://api.fake-rest.refine.dev",
                            axiosInstance
                        )}
                        notificationProvider={notificationProvider}
                        resources={[
                            {
                                name: "blog_posts",
                                list: "/blog-posts",
                                show: "/blog-posts/show/:id",
                                create: "/blog-posts/create",
                                edit: "/blog-posts/edit/:id",
                                meta: {
                                    canDelete: true,
                                },
                            },
                        ]}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                        }}
                    >
                        <Routes>
                            <Route
                                element={
                                    <Authenticated
                                        fallback={
                                            <CatchAllNavigate to="/login" />
                                        }
                                    >
                                        <ThemedLayoutV2>
                                            <Outlet />
                                        </ThemedLayoutV2>
                                    </Authenticated>
                                }
                            >
                                <Route
                                    index
                                    element={
                                        <NavigateToResource resource="blog_posts" />
                                    }
                                />
                                <Route path="blog-posts">
                                    <Route index element={<BlogPostList />} />
                                    <Route
                                        path="show/:id"
                                        element={<BlogPostShow />}
                                    />
                                    <Route
                                        path="edit/:id"
                                        element={<BlogPostEdit />}
                                    />
                                    <Route
                                        path="create"
                                        element={<BlogPostCreate />}
                                    />
                                </Route>
                            </Route>
                            <Route
                                element={
                                    <Authenticated fallback={<Outlet />}>
                                        <NavigateToResource />
                                    </Authenticated>
                                }
                            >
                                <Route path="login" element={<LoginPage />} />
                                <Route
                                    path="register"
                                    element={<RegisterPage />}
                                />
                                <Route
                                    path="forgot-password"
                                    element={<ForgotPasswordPage />}
                                />
                                <Route
                                    path="update-password"
                                    element={<UpdatePasswordPage />}
                                />
                            </Route>
                            <Route
                                element={
                                    <Authenticated fallback={<Outlet />}>
                                        <ThemedLayoutV2>
                                            <Outlet />
                                        </ThemedLayoutV2>
                                    </Authenticated>
                                }
                            >
                                <Route path="*" element={<ErrorComponent />} />
                            </Route>
                        </Routes>
                        <UnsavedChangesNotifier />
                    </Refine>
                </BrowserRouter>
            </RefineSnackbarProvider>
        </ThemeProvider>
    );
};

export default App;
