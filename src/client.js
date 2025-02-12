// Bulma CSS for light weight CSS. One can any css framework
import 'bulma/css/bulma.min.css';
import './resources/css/util.scss';
import './resources/css/global.scss';
import './resources/css/style.css';

import ReduxClient from '@pawjs/redux/client';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducers from './reducers';

const loggerMiddleware = createLogger();
const isProduction = process.env.NODE_ENV === 'production';

export default class Client {
  advertiseTimeout = 0;

  constructor({ addPlugin }) {
    const reduxClient = new ReduxClient({ addPlugin });
    reduxClient.setReducers(reducers);
    // If you want to add some redux middleware
    reduxClient.addMiddleware(thunkMiddleware);
    if (!isProduction) reduxClient.addMiddleware(loggerMiddleware);

    // If you want to add some redux enahncers
    // reduxClient.addEnhancer(SomeEnhancer);
    addPlugin(reduxClient);

    // ...
  }

  clearAdvertiseTimeout() {
    if (this.advertiseTimeout) {
      clearTimeout(this.advertiseTimeout);
    }
    this.advertiseTimeout = 0;
  }

  advertise() {
    this.clearAdvertiseTimeout();
    this.advertiseTimeout = setTimeout(() => {
      let codeFundDiv = document.getElementById('codefund_ad');
      if (!codeFundDiv) {
        codeFundDiv = document.createElement('div');
        codeFundDiv.id = 'codefund';
        const footerElement = document.querySelector('footer.footer');
        if (footerElement) {
          const jsCodefund = document.getElementById('js-codefund');
          if (jsCodefund) {
            footerElement.appendChild(codeFundDiv);
            if (jsCodefund.src) {
              const newJsCodefund = document.createElement('script');
              setTimeout(() => {
                newJsCodefund.src = `${jsCodefund.getAttribute(
                  'data-src'
                )}?v=${new Date().getTime()}`;
                newJsCodefund.id = jsCodefund.id;
                newJsCodefund.setAttribute(
                  'data-src',
                  jsCodefund.getAttribute('data-src')
                );
                jsCodefund.remove();
                document.body.append(newJsCodefund);
              }, 100);
              //
            } else {
              jsCodefund.src = jsCodefund.getAttribute('data-src');
            }
          }
        }
      } else {
        const jsCodefund = document.getElementById('js-codefund');
        if (jsCodefund) {
          if (jsCodefund.src) {
            const newJsCodefund = document.createElement('script');
            setTimeout(() => {
              newJsCodefund.src = `${jsCodefund.getAttribute('data-src')}`;
              newJsCodefund.id = jsCodefund.id;
              newJsCodefund.setAttribute(
                'data-src',
                jsCodefund.getAttribute('data-src')
              );
              jsCodefund.remove();
              document.body.append(newJsCodefund);
            }, 100);
          } else {
            jsCodefund.src = jsCodefund.getAttribute('data-src');
          }
        }
      }
    }, 100);
  }

  static googleTrack() {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'UA-108804791-2', {
        page_path: window.location.pathname
      });
    }
  }

  apply(clientHandler) {
    clientHandler.hooks.locationChange.tapPromise('ReloadAds', async () =>
      this.advertise()
    );
    clientHandler.hooks.locationChange.tapPromise(
      'ReloadGoogleTrack',
      async () => Client.googleTrack()
    );
    clientHandler.hooks.renderComplete.tap('ReloadAds', async () =>
      this.advertise()
    );
    clientHandler.hooks.reduxInitialState.tapPromise(
      'ReduxInitialState',
      async ({ getInitialState, setInitialState }) => {
        const initialState = Object.assign(
          {},
          getInitialState(),
          AppInitialState
        );
        // You can also wait for something async to happen
        // await fetch("/api/counter/details") and add it to the initial state if needed
        setInitialState(initialState);
      }
    );
  }
}
