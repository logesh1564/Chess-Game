import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./store/userSlice/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>

  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>

  // </React.StrictMode>
);
