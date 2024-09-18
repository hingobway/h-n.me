import { forwardRef } from 'react';

export const ArrowSVG = forwardRef(({ ...props }, ref) => {
  return (
    <>
      <svg
        ref={ref}
        width="106"
        height="41"
        viewBox="0 0 106 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M73.6408 40.5C74.6408 37.9 75.7408 35.5 76.9408 33.3C78.1408 31 79.4908 28.85 80.9908 26.85H0.59082V14.55H80.9908C79.5908 12.55 78.2908 10.45 77.0908 8.25003C75.8908 5.95003 74.7908 3.50003 73.7908 0.900024H85.1908C91.3908 8.20003 98.1908 13.75 105.591 17.55V24C98.1908 27.6 91.3908 33.1 85.1908 40.5H73.6408Z"
          fill="currentColor"
        />
      </svg>
    </>
  );
});
ArrowSVG.displayName = 'ArrowSVG';
