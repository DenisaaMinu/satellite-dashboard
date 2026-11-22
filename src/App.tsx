import { BrowserRouter } from "react-router";
import { AppRoutes } from "./router";

// BrowserRouter keeps the URL in the address bar in sync with the page.
// Everything that uses routing (NavLink, Outlet, Routes) must be inside it.
function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;
