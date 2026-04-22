import { SearchIcon } from "./icons/SeachIcon";

export const BarraBusqueda = ({ searchTerm, setSearchTerm, placeholder }) => {
  return (
    <div className="mb-6 flex justify-center w-full">
      <div className="relative w-full max-w-4xl">
        <input 
          type="text" 
          placeholder={placeholder || "Buscar..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 px-6 rounded-full border bg-white border-gray-200 shadow-sm focus:outline-none focus:border-action focus:ring-1 focus:ring-action/50 transition-all font-poppins"
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none">
          <SearchIcon className="w-6 h-6" />
        </span>
      </div>
    </div>
  );
};