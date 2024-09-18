import { useEffect, useMemo, useState } from 'react';
import { Transition } from '@headlessui/react';

import { clsx } from '../utility/classConcat';

const codes = {
  BAD_URL: `That URL doesn't seem to be valid.`,
  CUSTOM_PATH_INVALID: `Custom paths must be at least 4 characters long and only contain letters, numbers, -, and _.`,
  PATH_TAKEN: `That custom path is already taken.`,
  SERVER_ERROR: `The server is having trouble right now.`,
  EMAIL_ERROR: `Email failed to deliver. Make sure it's correct.`,
  MISSING_PARAMS: `Please enter something.`,
  CODE_INVALID: `That code isn't valid.`,
};
const status = ['SUCCESS!', 'ERROR:'];
const bg = [
  `bg-gradient-to-b from-[#159700] to-[#117D00]`,
  `bg-gradient-to-b from-[#B90000] to-[#9D0000]`,
];

// COMPONENT
export default function Alert({ code: code_, type: type_ }) {
  const TIME = 200;

  const [code, setCode] = useState(code_);
  const [type, setType] = useState(type_);
  useEffect(() => {
    if (typeof type_ !== 'number') {
      setTimeout(() => {
        setType(type_);
        setCode(code_);
      }, TIME);
    } else {
      setType(type_);
      setCode(code_);
    }
  }, [code_, type_]);

  const types = useMemo(
    () => [
      'Copied to your clipboard.', // 0
      code
        ? codes[code]
          ? `${codes[code]}`
          : `${code}`
        : 'Something went wrong. Try again later.',
    ],
    [code],
  );

  return (
    <>
      <Transition show={typeof type_ === 'number'}>
        <div
          className={clsx(
            `fixed bottom-7 mx-8 flex flex-row items-center gap-x-5 rounded-[22px] px-7 py-2 text-dwhite/90 shadow-floating`,
            /* variant */ bg[type],
            /* transition */ 'translate-y-0 transition data-[closed]:translate-y-[77px]',
            /* transition timing */ 'data-[enter]:ease-out data-[leave]:ease-in',
          )}
          style={{
            transitionDuration: TIME,
          }}
        >
          <div className="text-base">{status[type]}</div>
          <div className="max-w-sm text-lg">{types[type]}</div>
        </div>
      </Transition>
    </>
  );
}
