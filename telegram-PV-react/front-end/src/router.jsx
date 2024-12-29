import Index from "./pages/Index"
import Auth from "./pages/Auth";

const routes = [
    { path: "/", element: <Index /> },
    { path: "/auth", element: <Auth /> }
];

export default routes;