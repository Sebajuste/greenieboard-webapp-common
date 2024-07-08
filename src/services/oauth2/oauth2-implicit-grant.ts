import { AuthHandler } from "../../contexts/auth-context";

function sanitizeUrl(url: string): string {
  const to = url.lastIndexOf('/');
  return to === (url.length - 1) ? url.substring(0, to) : url;
}

export type ImplicitGrantParams = {
  clientId: string;
  authorizationUrl: string;
  redirectPath: string;
  scope: string;
  tokenResult?: (result: any) => string;
  popupWidth?: number;
  popupHeight?: number;
}

export function OAuth2ImplicitGrant(params: ImplicitGrantParams) {

  /*
  const oauth2Params = {
    // clientId: params.clientId,
    redirectUri: window.location.origin + params.redirectPath,
    scope: params.scope,
    display: 'popup',
    response_type: 'token'
  };
  */

  // const popupUrl = `${params.authorizationUrl}?${new URLSearchParams(oauth2Params).toString()}`;
  const popupUrl = params.authorizationUrl;

  const pollPopup = (window: Window): Promise<any> => {

    return new Promise((resolve, reject) => {
      const redirectUri = new URL(params.redirectPath);
      const redirectUriPath = redirectUri.host + redirectUri.pathname;

      const polling = setInterval(() => {

        if (!window || window.closed || window.closed == undefined) {
          clearInterval(polling);
          reject(new Error('The popup window was closed'));
          return;
        }

        try {
          const popupUrlPath = window.location.host + window.location.pathname;

          console.log('popupUrlPath: ', popupUrlPath)

          if (sanitizeUrl(popupUrlPath) === sanitizeUrl(redirectUriPath)) {

            if (window.location.search || window.location.hash) {

              console.log('window.location.search: ', window.location.search)
              console.log('window.location.hash: ', window.location.hash)

              const query = Object.fromEntries(new URLSearchParams(window.location.search.substring(1).replace(/\/$/, '')));
              const hash = Object.fromEntries(new URLSearchParams(window.location.hash.substring(1).replace(/[\/$]/, '')));

              console.log('query: ', query);
              console.log('hash: ', hash);

              const token = Object.assign({}, query, hash);

              if (token.error) {
                reject(new Error(token.error));
              } else {
                resolve(token);
              }

            } else {
              reject(new Error('OAuth refirect has occured but no query or hash parameters were found'));
            }

            // cleanup
            clearInterval(polling);
            window.close();
          } else {
            reject(new Error('Invalid popupUrlPath'));
          }

        } catch (err) {
          // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
        }

      }, 500);


    });

  };

  const login = (): Promise<any> => {

    const options = {
      width: params.popupWidth || 500,
      height: params.popupHeight || 500,
      top: window.screenY + ((window.outerHeight - (params.popupHeight || 500)) / 2.5),
      left: window.screenX + ((window.outerWidth - (params.popupWidth || 500)) / 2)
    };

    const popup = window.open(popupUrl, '_blank', `width=${options.width},height=${options.height},top=${options.top},left=${options.left}`);

    if (popupUrl === 'about:blank' && popup) {
      popup.document.body.innerHTML = 'Loading...';
    }

    return popup ? pollPopup(popup) : new Promise((resolve, reject) => { reject(new Error('Invalid popup')) });

  };


  return {
    login: login,
    logout: () => { },
    register: (email: string, password: string, username: string) => Promise.resolve()
  } as AuthHandler;

}