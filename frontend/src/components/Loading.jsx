// Reusable loading spinner.
export const Loading = ({ label = 'Loading...', fullScreen = false }) => (
  <div
    className={
      fullScreen
        ? 'min-h-[50vh] flex flex-col items-center justify-center gap-4'
        : 'flex items-center justify-center gap-3 py-8'
    }
    role="status"
    aria-live="polite"
  >
    <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    <p className="text-sm text-[var(--color-muted)]">{label}</p>
  </div>
);
