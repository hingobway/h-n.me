import { useState, useEffect, useRef } from 'react';

import axios from 'axios';

import { api } from '../utility/dev';
import { clmx, clsx } from '../utility/classConcat';

import Alert from '../components/alert';
import Account from '../components/Account';

import ClearButton from '../components/ClearButton';
import { ArrowSVG } from '../components/icon_arrow';

export default function Home() {
  const urlRef = useRef(null);
  const taRef = useRef(null);
  useEffect(() => {
    urlRef.current.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [path, setPath] = useState('');
  const [url, setURL] = useState('');

  const [alert, setAlert] = useState([]);
  useEffect(() => {
    let alertdelay;
    if (alert.length) {
      alertdelay = setTimeout(() => {
        setAlert([]);
      }, 9000);
    }

    return () => {
      clearTimeout(alertdelay);
    };
  }, [alert]);

  const [accountAuth, setAccountAuth] = useState('');

  const clearPath = () => {
    setPath('');
  };
  const handleChange = (e) => {
    const value = (e.target.value.match(/\S/g) || ['']).join('');
    if (e.target.name == 'path') setPath(value);
    if (e.target.name == 'url') setURL(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    urlRef.current.blur();
    setPath(e.target.path.value);
    setURL(e.target.url.value);

    try {
      const { data } = await axios.post(
        api + '/api/new',
        {
          path,
          url,
        },
        {
          headers: {
            authorization: `Bearer ${accountAuth ? accountAuth.token : ''}`,
          },
        },
      );

      if (!(data && data.path && data.url)) return setAlert([1]);

      setURL('');
      setPath(data.path);

      taRef.current.innerText = data.url;
      taRef.current.select();
      window.document.execCommand('copy');
      taRef.current.blur();

      setAlert([0]);
    } catch (err) {
      if (err.response) {
        setAlert([1, err.response.data.error]);
        console.log(
          err.response.status,
          err.response.statusText,
          err.response.data,
        );
      } else {
        setAlert([1]);
        console.log(err);
      }
    }
  };

  return (
    <>
      <Account {...{ setAccountAuth, setAlert }} />
      <div className="--max-w-screen-2xl mx-[-40px] flex scale-75 flex-col items-stretch text-7xl md:mx-0 md:scale-100">
        <form onSubmit={handleSubmit}>
          {/* top row */}
          <div className="mb-6 flex flex-1 flex-row items-center justify-stretch">
            <div
              className={clmx(
                'text-dwhite',
                alert[0] !== 0 && 'text-opacity-40',
              )}
            >
              h-n.me/
            </div>
            <div
              className={clsx(
                'relative flex-1 rounded-md',
                /* focus */ 'ring-black/15 ring-offset-0 focus-within:ring-1',
              )}
            >
              {/* path input */}
              <input
                type="text"
                name="path"
                onChange={handleChange}
                value={path}
                placeholder="?????"
                className={clsx(
                  'block w-full rounded-md border-0 bg-black/[.06] px-4 py-2 text-7xl',
                  /* placeholder */ 'placeholder:text-dwhite/90 placeholder:opacity-[.18]',
                  /* focus */ 'focus:outline-none',
                )}
              />
              <div className="invisible absolute inset-y-0 right-0 flex flex-row items-center rounded-r-md bg-bmatch pr-7 sm:visible">
                <div className="ml-[-26px] h-full w-7 bg-gradient-to-l from-bmatch to-transparent"></div>
                <ClearButton onClick={clearPath} disabled={!path.length} />
              </div>
            </div>
          </div>

          {/* bottom row */}
          <div className="flex flex-row-reverse items-center justify-stretch gap-6 md:my-[-19.5px] md:gap-9">
            <div className="flex-1">
              {/* url input */}
              <input
                type="text"
                name="url"
                onChange={handleChange}
                value={url}
                ref={urlRef}
                placeholder="https://"
                className={clsx(
                  'w-full rounded-md border border-dwhite/10 bg-bg-dwhite px-6 py-2.5 text-5xl shadow-tight',
                  /* placeholder */ 'placeholder:text-dwhite/10 placeholder:opacity-70',
                  /* focus */ 'ring-dwhite/20 focus:outline-none focus:ring-1',
                )}
              />
            </div>
            {/* submit arrow button */}
            <button
              type="submit"
              aria-label="submit"
              className={clmx(
                `-m-6 cursor-pointer select-none p-6 text-8xl`,
                alert[0] === 0 && 'text-dwhite/40',
              )}
            >
              <ArrowSVG className="h-full" />
            </button>
          </div>
        </form>
      </div>
      <textarea ref={taRef} className="fixed right-[-10000px]"></textarea>

      <Alert type={alert[0]} code={alert[1]} />
    </>
  );
}
