import { useState, useEffect } from 'react';

import axios from 'axios';

import { isDev, api } from '../utility/dev';

const Error404 = () => {
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
    (async () => {
      const newURL = `${api}${window.location.pathname}${window.location.search}`;
      const curURL = `${
        !isDev
          ? `${window.location.protocol}//${window.location.host}`
          : `https://www.h-n.me`
      }${window.location.pathname}`;
      try {
        await axios.get(newURL);
        window.location = newURL;
      } catch (e) {
        if (e.request.responseURL !== curURL) window.location = newURL;
        else setLoading(false);
      }
    })();
  }, []);

  return loading ? (
    <>
      {!show ? null : (
        <div className="h-full flex flex-col justify-center">
          <div className="h-[24px] aspect-square border-[3px] rounded-full border-dwhite/20 border-t-dwhite animate-spin"></div>
        </div>
      )}
      <noscript>
        <code>404</code>
      </noscript>
    </>
  ) : (
    <div>
      <code>404</code>
    </div>
  );
};

export default Error404;
