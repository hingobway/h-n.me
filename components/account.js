import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import axios from 'axios';
import qs from 'qs';

import AccountIcon from './icon_account';
import LogoutIcon from './icon_logout';

const domain = 'https://h-n.me/';
const ACCOUNT_STORAGE = 'user';

const Account = ({ setAlert, setAccountAuth }) => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [account, setAccount] = useState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setAccountAuth(account), [account]);

  const [input, setInput] = useState('');
  useEffect(() => {}, [input]);
  const inputChange = (e) => {
    setInput(stages[stage].validate(e.target.value));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.get(domain + 'api/auth/login', {
        params: { email: e.target.email.value },
      });

      setInput('');
      setEmail(e.target.email.value);
      e.target.email.focus();
      setStage(1);
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
  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.get(domain + 'api/auth/verify/code', {
        params: { email, code: e.target.code.value },
      });

      localStorage.setItem(ACCOUNT_STORAGE, JSON.stringify(data));
      setAccount(data);
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
  const handleLogout = async (e) => {
    localStorage.removeItem(ACCOUNT_STORAGE);
    window.location.reload();
  };

  const stages = [
    {
      placeholder: 'Enter your email',
      name: 'email',
      type: 'email',
      validate: (val) => (val.match(/\S/g) || ['']).join(''),
      submit: handleLogin,
    },
    {
      placeholder: 'Enter login code',
      name: 'code',
      type: 'text',
      validate: (val) => (val.match(/\d/g) || ['']).join(''),
      submit: handleVerify,
    },
  ];
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // verify link flow
    (async () => {
      let s = window.location.search;
      if (s) {
        const { verify } = qs.parse(s.slice(1));
        if (!verify) return;

        try {
          const { data } = await axios.get(domain + 'api/auth/verify/token', {
            params: { token: verify },
          });

          localStorage.setItem(ACCOUNT_STORAGE, JSON.stringify(data));
          setAccount(data);
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
        } finally {
          router.push('/');
        }
      }
    })();

    // check for stored token
    (async () => {
      let a = localStorage.getItem(ACCOUNT_STORAGE);
      try {
        a = JSON.parse(a);
      } catch (e) {
        return;
      }
      if (a && a.token) {
        try {
          const { data } = await axios.get(domain + 'api/user', {
            headers: { authorization: `Bearer ${a.token}` },
          });
          a.user = data.user;
          localStorage.setItem(ACCOUNT_STORAGE, JSON.stringify(a));
          setAccount(a);
        } catch (err) {
          localStorage.removeItem(ACCOUNT_STORAGE);
          if (err.response) {
            console.log(
              err.response.status,
              err.response.statusText,
              err.response.data
            );
          } else {
            console.log(err);
          }
        }
      }
    })();
    return;
  }, []);

  return (
    <div className="flex row items-center absolute top-4 left-5 ml-3 mr-20 py-1.5 gap-x-5 text-dwhite/90 text-lg">
      <AccountIcon />
      <div className={` ${account ? 'hidden' : ''}`}>
        <form onSubmit={stages[stage].submit}>
          <input
            type={stages[stage].type}
            name={stages[stage].name}
            value={input}
            size={input.length || 13}
            onChange={inputChange}
            placeholder={stages[stage].placeholder}
            className="block w-full  bg-transparent outline-0 font-bold placeholder:opacity-40"
          />
        </form>
      </div>
      {!account ? null : (
        <div className="flex row items-center p-[3px] pl-6 gap-5 rounded-full border border-dwhite/10 bg-bg-dwhite">
          <div className="t">{account.user.email}</div>
          <div
            className="bg-dwhite/90 rounded-full p-1 cursor-pointer"
            onClick={handleLogout}
          >
            <LogoutIcon />
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
