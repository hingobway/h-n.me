import { useState, useEffect, useRef } from 'react';

import axios from 'axios';

import Alert from '../components/alert';
import Account from '../components/account';

import ClearIcon from '../components/icon_clear';

export default function Home() {
  const urlRef = useRef(null);
  const submitRef = useRef(null);
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
        'https://h-n.me/api/new',
        {
          path,
          url,
        },
        {
          headers: {
            authorization: `Bearer ${accountAuth ? accountAuth.token : ''}`,
          },
        }
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
          err.response.data
        );
      } else {
        setAlert([1]);
        console.log(err);
      }
    }
  };

  return (
    <>
      <Account setAccountAuth={(a) => setAccountAuth(a)} setAlert={setAlert} />
      <div className="text-7xl flex flex-col items-stretch --max-w-screen-2xl md:scale-100 scale-75 md:mx-0 mx-[-40px]">
        <form onSubmit={handleSubmit}>
          <div className="flex-1 flex flex-row justify-stretch items-center mb-6">
            <div className={`text-dwhite${alert[0] !== 0 ? '/40' : ''}`}>
              h-n.me/
            </div>
            <div className="flex-1 rounded-md bg-black/[.06] px-4 py-2 relative">
              <input
                type="text"
                name="path"
                onChange={handleChange}
                value={path}
                placeholder="?????"
                className="w-full block bg-transparent outline-0 text-7xl border-0 placeholder:opacity-[.18] placeholder:text-dwhite/90"
                width="50"
              />
              <div className="invisible sm:visible absolute inset-y-0 right-0 pr-7 flex flex-row items-center bg-bmatch rounded-r-md">
                <div className="bg-gradient-to-l from-bmatch to-transparent h-full w-7 ml-[-26px]"></div>
                <ClearIcon on={path.length > 0} onClick={clearPath} />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-stretch items-center md:my-[-19.5px]">
            <div
              className={`text-8xl select-none cursor-pointer md:text-[150px] mt-[-2rem] mr-6 md:mr-9 ${
                alert[0] === 0 ? 'text-dwhite/40' : ''
              }`}
              onClick={() => submitRef.current.click()}
            >
              &rarr;
            </div>
            <div className="flex-1 border text-5xl border-dwhite/10 rounded-md bg-bg-dwhite py-2.5 px-6 shadow-tight">
              <input
                type="text"
                name="url"
                onChange={handleChange}
                value={url}
                ref={urlRef}
                placeholder="https://"
                className="w-full block outline-0  bg-transparent  placeholder:opacity-70 placeholder:text-dwhite/10"
              />
              <input ref={submitRef} type="submit" className="hidden" />
            </div>
          </div>
        </form>
      </div>
      <textarea ref={taRef} className="fixed right-[-10000px]"></textarea>

      <Alert type={alert[0]} code={alert[1]} />
    </>
  );
}
