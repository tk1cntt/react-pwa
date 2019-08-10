import React from 'react';
import ReactPWAIcon from './resources/img/react-pwa.png';
import ReduxServer from "@pawjs/redux/server";
import thunkMiddleware from "redux-thunk"
import { createLogger } from "redux-logger"
import reducers from "./reducers";

const loggerMiddleware = createLogger()
const isProduction = process.env.NODE_ENV === "production"

export default class Server {
  constructor({addPlugin}) {

    const reduxServer = new ReduxServer({addPlugin});
    reduxServer.setReducers(reducers);
    // If you want to add some redux middleware
    reduxServer.addMiddleware(thunkMiddleware);
    if (!isProduction) reduxServer.addMiddleware(loggerMiddleware);
    
    // If you want to add some redux enahncers
    // reduxServer.addEnhancer(SomeEnhancer);
    addPlugin(reduxServer);
    
    // ...
  }

  // eslint-disable-next-line
  apply(serverHandler) {
    serverHandler.hooks.beforeHtmlRender.tapPromise('DSNPreCache', async (Application) => {
      const { htmlProps: { head } } = Application;
      head.push(<link key="dns-precache-demo-cdn" rel="preconnect" href="https://demo-cdn.reactpwa.com" />);
      head.push(<link key="dns-precache-codefund" rel="preconnect" href="https://codefund.app" />);
      head.push(<link key="dns-precache-google-analytics" rel="preconnect" href="https://www.google-analytics.com" />);
      head.push(<link key="dns-precache-googletagmanager" rel="preconnect" href="https://www.googletagmanager.com" />);
      head.push(<link key="antd-lib" async rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.10.4/antd.min.css"/>);
      // head.push(<script key="antd-lib" async src="https://cdnjs.cloudflare.com/ajax/libs/antd/3.10.4/antd.min.css"/>);
      head.push(<meta key="meta-theme-color" name="theme-color" content="#209cee" />);
      //
    });

    serverHandler.hooks.beforeHtmlRender.tapPromise('AddFavIcon', async (Application) => {
      const { htmlProps: { head } } = Application;
      head.push(<link key="favicon" rel="shortcut icon" type="image/png" href={ReactPWAIcon} />);
      return true;
    });

    serverHandler.hooks.beforeHtmlRender.tapPromise('AddGoogleTracking', async (Application) => {
      Application.htmlProps.footer.push(<script async key="googleanalyticslink" src="https://www.googletagmanager.com/gtag/js?id=UA-108804791-2" />);
      Application.htmlProps.footer.push(<script
        key="googleanalyticsscript"
        // eslint-disable-next-line
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-108804791-2');`,
        }}
      />);
    });

    serverHandler
      .hooks
      .reduxInitialState
      .tapPromise("AppInitialState", async ({getInitialState, setInitialState}) => {
        const initialState = Object.assign({}, getInitialState(), AppInitialState);
        // You can also wait for something async to happen
        // await fetch("/api/counter/details") and add it to the initial state if needed
        setInitialState(initialState);
      });
  }

}
