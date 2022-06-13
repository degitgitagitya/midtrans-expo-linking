import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

import Constants from 'expo-constants';

interface UsePaymentGatewayConfig {
  warmUpBrowser: boolean;
}

interface UsePaymentGatewayCallback {
  onBrowserOpenData: (data: WebBrowser.WebBrowserResult) => void;
  onRedirectData: (data: Linking.ParsedURL) => void;
  onError: (error: unknown) => void;
}

const usePaymentGateway = (
  { warmUpBrowser }: UsePaymentGatewayConfig = { warmUpBrowser: true },
  callback: UsePaymentGatewayCallback | undefined = undefined
) => {
  React.useEffect(() => {
    if (warmUpBrowser) {
      WebBrowser.warmUpAsync();
    }
  }, [warmUpBrowser]);

  const addLinkingListener = React.useCallback(() => {
    Linking.addEventListener('url', handleRedirect);
  }, []);

  const removeLinkingListener = React.useCallback(() => {
    Linking.removeEventListener('url', handleRedirect);
  }, []);

  const handleOpenBrowser = React.useCallback(
    async (url: string) => {
      try {
        addLinkingListener();
        let result = await WebBrowser.openBrowserAsync(url);

        // idk behavior on iOS
        if (Constants?.platform?.ios) {
          removeLinkingListener();
        }

        callback?.onBrowserOpenData(result);
      } catch (error) {
        callback?.onError(error);
      }
    },
    [callback, addLinkingListener, removeLinkingListener]
  );

  const handleRedirect = React.useCallback(
    (event) => {
      if (Constants?.platform?.ios) {
        WebBrowser.dismissBrowser();
      } else {
        removeLinkingListener();
      }

      let data = Linking.parse(event.url);

      callback?.onRedirectData(data);
    },
    [removeLinkingListener, callback]
  );

  const dismiss = React.useCallback(() => {
    WebBrowser.dismissBrowser();
  }, []);

  return { handleOpenBrowser, dismiss };
};

export default usePaymentGateway;
