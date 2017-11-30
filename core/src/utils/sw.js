import React from "react";
import ReactDOMServer from "react-dom/server";
import _ from "lodash";
import Html from "../components/html";
import {getModuleByUrl, getRouteFromPath} from "./bundler";


// As service worker has special scope for self lets store it to variable
// eslint-disable-next-line
const serviceWorker = self;

/**
 * Log to console if environment is development
 * @param args
 */
export const log = (...args) => {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line
    console.log("\n");console.log(...args);
  }
};

/**
 *
 * @param currentCacheName
 * @param cachePrefix
 * @returns {Promise.<TResult>|*}
 */
export const deleteOldCache = (currentCacheName = "", cachePrefix = "") => {
  return caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        if (currentCacheName !== cacheName && cacheName.startsWith(cachePrefix)) {
          return caches.delete(cacheName);
        }
      })
    );
  });
};

/**
 * Send message to all clients
 * @param serviceWorker
 * @param message
 * @returns {Promise}
 */
export const messageAllClients = (serviceWorker, message) => {
  let msg = generateMessage(message);
  return new Promise(resolve => {
    serviceWorker
      .clients
      .matchAll()
      .then(clients => {
        return Promise.all(_.map(clients, client => {
          return postMessage(client, msg);
        }));
      }).then(resolve);
  });
};

/**
 * Generate message from * Generic data and send object accordingly
 * @param data
 * @returns {*}
 */
const generateMessage = (data) => {
  if (!data || _.isEmpty(data)) {
    throw new Error("Cannot send empty/null/undefined data!");
  }
  let message = data;
  if (_.isString(data)) {
    message = {
      message: data
    };
  }
  return message;
};

/**
 * Post a message to client
 * @param client
 * @param message
 * @returns {Promise.<*>}
 */
const postMessage = async (client, message = {}) => {
  if (client && client.postMessage) {
    return client.postMessage(JSON.stringify(message));
  }
  return Promise.resolve();
};

/**
 * Decode a message received to Service worker
 * via json parse
 * @param data
 * @returns {*}
 */
export const decodeMessage = data => {
  let msg = data;
  if (_.isString(data)) {
    try {
      msg = JSON.parse(data);
    } catch (ex) {
      msg = data;
    }
  }
  return msg;
};

/**
 * Return Offline HTML required to run the application
 * @param url
 * @returns {*}
 */
export const getOfflineHtml = (url = "/") => {
  
  const globals = serviceWorker._GLOBALS;
  let routes = _.assignIn({}, _.get(globals, "routes", []));
  const currentRoutes = getRouteFromPath(url, routes);
  
  const allCss = _.get(globals, "allCss", []);
  const allJs = _.get(globals, "allJs", []);
  //
  let mod = getModuleByUrl(url, routes);
  
  /**
   * Get css generated by current route and module
   */
  const currentRouteCss = _.filter(allCss, css => {
    const fileName = css.split("/").pop();
    return !(_.startsWith(fileName, "mod-") && fileName.indexOf(mod) === -1);
  });
  
  /**
   * Get all javascript but the modules
   */
  const currentRouteJs = _.filter(allJs, js => {
    const fileName = js.split("/").pop();
    return !_.startsWith(fileName, "mod-") && !_.startsWith(fileName, "service-worker.js");
  });
  
  // Get seo details for the routes in an inherited manner
  // i.e. get seo details of parent when feasible
  let seoDetails = {};
  
  _.each(currentRoutes, r => {
    seoDetails = _.defaults({}, _.get(r, "seo", {}), seoDetails);
  });
  
  /**
   * Trying offline solution. Continue on that
   */
  return ReactDOMServer.renderToStaticMarkup((
    <Html
      stylesheets={currentRouteCss}
      scripts={currentRouteJs}
      seo={seoDetails}
    >
    </Html>
  ));
};