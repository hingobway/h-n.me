const clear = ({ on, onClick }) => {
  return (
    <div
      className={
        '-drop-shadow-big-center' +
        (on ? ' stroke-dwhite cursor-pointer' : ' stroke-almost-gray/90')
      }
      onClick={onClick}
    >
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
        <path
          className="stroke-inherit"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M17.25 6.75L6.75 17.25"
        ></path>
        <path
          className="stroke-inherit"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M6.75 6.75L17.25 17.25"
        ></path>
      </svg>
    </div>
  );
};

export default clear;
