export const LoadingSpinner = ({ mensaje = 'Cargando...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-main gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-primary font-bold tracking-widest uppercase text-sm">{mensaje}</p>
    </div>
  );
};