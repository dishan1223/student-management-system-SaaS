export default function SectionHeader({ title }) {
  return (
    <div className="w-full">
      <div className="px-4 pt-2 pb-1">
        <span className="text-base font-medium text-gray-800">{title}</span>
      </div>
      <hr className="border-gray-300 mx-4" />
    </div>
  );
}
