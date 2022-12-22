import { useEffect, useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

const Alert = ({ code: code_, type: type_ }) => {
  const alertRef = useRef(null);
  const [unmount, setUnmount] = useState(false);

  const TIME = 200;

  const [code, setCode] = useState(code_);
  const [type, setType] = useState(type_);
  useEffect(() => {
    if (typeof type_ !== 'number') {
      setUnmount(true);
      setTimeout(() => {
        setType(type_);
        setCode(code_);
        setUnmount(false);
      }, TIME);
    } else {
      setType(type_);
      setCode(code_);
    }
  }, [code_, type_]);

  const codes = {
    BAD_URL: `That URL doesn't seem to be valid.`,
    CUSTOM_PATH_INVALID: `Custom paths must be at least 4 characters long and only contain letters, numbers, -, and _.`,
    PATH_TAKEN: `That custom path is already taken.`,
    SERVER_ERROR: `The server is having trouble right now.`,
    EMAIL_ERROR: `Email failed to deliver. Make sure it's correct.`,
    MISSING_PARAMS: `Please enter something.`,
    CODE_INVALID: `That code isn't valid.`,
  };
  const types = [
    'Copied to your clipboard.', // 0
    code
      ? codes[code]
        ? `${codes[code]}`
        : `${code}`
      : 'Something went wrong. Try again later.',
  ];
  const status = ['SUCCESS!', 'ERROR:'];
  const bg = [
    `bg-gradient-to-b from-[#159700] to-[#117D00]`,
    `bg-gradient-to-b from-[#B90000] to-[#9D0000]`,
  ];

  return (
    <>
      <CSSTransition
        in={!(unmount || typeof type !== 'number')}
        // in={false}
        nodeRef={alertRef}
        timeout={TIME}
        classNames="alert"
        unmountOnExit
      >
        <div
          ref={alertRef}
          className={`text-dwhite/90 rounded-[22px] flex flex-row items-center gap-x-5 fixed bottom-7 mx-8 px-7 py-2 shadow-floating ${bg[type]}`}
        >
          <div className="text-base">{status[type]}</div>
          <div className="text-lg max-w-sm">{types[type]}</div>
        </div>
      </CSSTransition>

      <style jsx>{`
        .alert-enter {
          transform: translateY(77px);
        }
        .alert-enter-active {
          transform: none;
          transition: transform ${TIME}ms ease-out;
        }
        .alert-exit {
          transform: none;
        }
        .alert-exit-active {
          transform: translateY(77px);
          transition: transform ${TIME}ms ease-in;
        }
      `}</style>
    </>
  );
};

export default Alert;
