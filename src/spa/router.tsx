import { createBrowserRouter } from "react-router-dom";

// App Root, Layouts
import App from "./app"
import MainLayout from "./main-layout";
import IndexPage from "./home-page";

export default function createRouter()
{
    return createBrowserRouter([
        {      
          element: <App  />,          
          children: [            
            {
              element: <MainLayout />,
              children: [
                {
                  path: "/",
                  element: <IndexPage />
                }                
              ]
            }
          ]
        },
      ],
      { }
    );
}
