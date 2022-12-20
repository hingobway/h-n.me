import { useEffect } from 'react';

const SDirect = () => {
  useEffect(() => {
    window.location = `https://h-n.me/` + window.location.pathname.slice(3);
  }, []);

  return null;
};

export default SDirect;
