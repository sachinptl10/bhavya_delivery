// Reusable inline error alert with an optional retry button.
export const Error = ({ message, onRetry }) => (
  <div
    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg px-4 py-3 text-sm"
    role="alert"
  >
    <p className="font-semibold mb-1">Something went wrong</p>
    <p className="mb-3">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-sm font-medium text-red-700 dark:text-red-300 underline underline-offset-2 hover:no-underline"
      >
        Try again
      </button>
    )}
  </div>
);
