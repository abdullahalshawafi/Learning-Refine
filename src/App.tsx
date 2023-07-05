import { 
    Refine,
    GitHubBanner, 
    WelcomePage,
    Authenticated, 
} from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

    import { AuthPage,ErrorComponent
,notificationProvider
,RefineSnackbarProvider
,ThemedLayoutV2} from '@refinedev/mui';

import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import routerBindings, { NavigateToResource, CatchAllNavigate, UnsavedChangesNotifier, DocumentTitleHandler } from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { Header } from "./components/header";





function App() {
    

    
    
    return (
        <BrowserRouter>
        <GitHubBanner />
        <RefineKbarProvider>
            <ColorModeContextProvider>
<CssBaseline />
<GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
<RefineSnackbarProvider>
            <Refine notificationProvider={notificationProvider}
routerProvider={routerBindings}
dataProvider={dataProvider("https://api.fake-rest.refine.dev")} 
                options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                     
                }}
            >


                    <Routes>
                        <Route index element={<WelcomePage />} />
                    </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
            </Refine>
            </RefineSnackbarProvider>


</ColorModeContextProvider>
        </RefineKbarProvider>
        </BrowserRouter>
      );
};

export default App;
