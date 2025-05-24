


interface ActivityTypeProps {
  name: string
  image: string
  selected?: boolean; 
}
const category = ({ name, image, selected = false }: ActivityTypeProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-30.5 w-22.5 bg-white rounded-lg overflow-hidden gap-3">
      <div
        className={`w-22.5 h-22.5 hover:border-3 hover:border-[var(--primary-color-600)] rounded-full flex items-center justify-center  ease-in-out overflow-hidden  hover:bg-[var(--primary-color-500)] hover:text-white transition-colors duration-200`}
      >
        <img
          className="w-full h-full object-cover"
          src={image}
          alt="Imagem da Categoria"
        />
      </div>

      <div className="">
        <h1 className="text-label">{name}</h1>
      </div>
    </div>
  );
};

export default category;