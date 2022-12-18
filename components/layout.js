import Link from 'next/link';

import Logo from './logo';

const layout = ({ children }) => {
  return (
    <>
      <div className="w-full h-full  flex flex-col items-center justify-center bg-gradient-to-br from-bg-dark to-bg-light md:px-16 lg:px-20 2xl:px-40">
        <Link href="/">
          <Logo className="fixed top-0 right-0 m-5 drop-shadow-logo" />
        </Link>
        <>{children}</>
      </div>
    </>
  );
};

export default layout;
