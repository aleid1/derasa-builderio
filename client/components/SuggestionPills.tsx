export default function SuggestionPills() {
  const suggestions = [
    "اطلب تلميحًا",
    "اشرح خطوة",
    "مثال إضافي",
    "تغيير الموضوع"
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center" dir="rtl">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium shadow-sm"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
