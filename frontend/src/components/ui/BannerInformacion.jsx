// Mensaje de información
export const BannerInformacion = ({ children }) => {
  if (!children) return null;

  return (
    <div className="mb-8 text-center bg-[#FFFBF2] py-4 px-6 rounded-xl border border-action/20 max-w-3xl mx-auto shadow-sm">
      <p className="text-sm md:text-base text-primary/80 font-poppins">
        <span className="font-bold text-action mr-2">ℹ️ Información:</span>
        {children}
      </p>
    </div>
  );
};
