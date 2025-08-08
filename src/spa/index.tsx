import * as ReactDOM from "react-dom/client";

// Routing
import { RouterProvider } from "react-router-dom";
import createRouter from "./router";


const router = createRouter();

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(    
    <RouterProvider router={router}  />
);
