import * as React from "react";
import { Outlet } from "react-router-dom";

export default class App extends React.Component {
 
  public render = (): React.ReactNode => {

    return (            
        <Outlet />              
    );
  }
}