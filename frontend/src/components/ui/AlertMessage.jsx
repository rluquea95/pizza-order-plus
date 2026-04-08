export const AlertMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mb-4 bg-red-50 text-red-600 border border-red-200 px-5 py-3 rounded-xl flex items-center gap-3 animate-fade-in shadow-sm">
      <span className="text-xl" aria-hidden="true">⚠️</span>
      <p className="text-sm font-medium font-poppins">{message}</p>
    </div>
  );
};