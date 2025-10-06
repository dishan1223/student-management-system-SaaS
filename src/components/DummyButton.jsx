import { FaLock } from "react-icons/fa";

export default function DummyButton({ title }) {
  return (
        <div className="flex justify-center mt-3">
    <div
      className="
        flex justify-center gap-3 items-center
        px-4 py-2 
        w-[90%]
        lg:w-auto
        border-2 border-gray-400 
        text-gray-400 
        rounded-xl 
        font-medium 
        transition 
        duration-200 
        hover:bg-blue-50
        active:scale-95
        text-center
      "
    >
      {title}
      <FaLock />
    </div>
    </div>
  );
}

