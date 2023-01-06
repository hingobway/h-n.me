import { useState, useEffect } from 'react';

import axios from 'axios';

const Error404 = () => {
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
    (async () => {
      const newURL = `https://h-n.me${window.location.pathname}${window.location.search}`;
      // const newURL = `http://localhost:3000${window.location.pathname}${window.location.search}`;
      const curURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
      // const curURL = `https://www.h-n.me${window.location.pathname}`;
      try {
        await axios.get(newURL);
        window.location = newURL;
      } catch (e) {
        if (e.request.responseURL !== curURL) window.location = newURL;
        setLoading(false);
      }
    })();
  }, []);

  return loading ? (
    <div className="h-full flex flex-col justify-end">
      {!show ? null : (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="h-[24px] aspect-square border-[3px] rounded-full border-dwhite/20 border-t-dwhite animate-spin"></div>
        </div>
      )}
      <div className="p-5 font-normal italic text-dwhite/50 text-center">
        If you can&rsquo;t see a loading icon above, the requested page was not
        found (404).
      </div>
    </div>
  ) : (
    <div>
      <code>404</code>
    </div>
  );
};

export default Error404;
