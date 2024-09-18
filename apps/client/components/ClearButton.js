export default function ClearButton({ disabled, onClick }) {
  return (
    <button
      aria-label="clear"
      className="stroke-dwhite disabled:stroke-almost-gray/90"
      disabled={disabled || null}
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
    </button>
  );
}
