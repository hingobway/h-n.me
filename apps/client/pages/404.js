import { useState, useEffect } from 'react';

import axios from 'axios';

import { api } from '../utility/dev';

const Error404 = () => {
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
    (async () => {
      try {
        const resp = await axios.get(
          api + '/api/link' + window.location.pathname,
        );
        const url = resp?.data?.link?.url;
        if (!url) throw 0;
        window.location = url;
      } catch (e) {
        setLoading(false);
      }
    })();
  }, []);

  return loading ? (
    <>
      {!show ? null : (
        <div className="flex h-full flex-col justify-center">
          <div className="aspect-square h-[24px] animate-spin rounded-full border-[3px] border-dwhite/20 border-t-dwhite"></div>
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
