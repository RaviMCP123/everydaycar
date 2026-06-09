import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "flatpickr/dist/flatpickr.css";
import "./i18n/config";
import App from "./App.tsx";
import { AppWrapper } from "@components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { store, persistor } from "./store";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
        <AppWrapper>
          <BrowserRouter>
            <App />
            <ToastContainer style={{ zIndex: 999999 }} />
          </BrowserRouter>
        </AppWrapper>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
