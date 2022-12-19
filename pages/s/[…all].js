import { useRouter } from 'next/router';

const s = () => {
  const router = useRouter();
  
  router.push(`https://h-n.me/${router.pathname.slice(3)}`);
  
  return null;
};

export default s;
