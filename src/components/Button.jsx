import Link from "next/link";

export default function Button({ title, href }) {
  return (
        <div className="flex justify-center mt-3">
    <Link
      href={href}
      aria-label={title}
      className="
        px-4 py-2 
        w-[90%]
        lg:w-auto
        border-2 border-blue-500 
        text-blue-500 
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
    </Link>
    </div>
  );
}

