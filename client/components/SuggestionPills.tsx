import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SuggestionPills() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const suggestions = [
    "اطلب تلميحًا",
    "اشرح خطوة بخطوة",
    "مثال إضافي",
    "تغيير الموضوع",
    "حل مسألة رياضية",
    "شرح مفهوم علمي",
    "تحليل نص أدبي",
    "مراجعة قواعد اللغة",
  ];

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Mouse drag scrolling for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2; // Multiply for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  // Wheel scrolling for desktop
  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollContainerRef.current) return;
    e.preventDefault();
    scrollContainerRef.current.scrollLeft += e.deltaY;
  };

  return (
    <div className="w-full max-w-4xl mx-auto" dir="rtl">
      <div className="relative">
        {/* Horizontal scroll container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide pb-4 scroll-smooth cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
        >
          <div className="flex gap-3 px-6 min-w-max">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() =>
                  navigate("/chat", { state: { initialMessage: suggestion } })
                }
                className={`
                  px-6 py-3 bg-white border border-neutral-200 rounded-full text-neutral-700
                  hover:bg-neutral-50 hover:border-neutral-300 hover:shadow-md
                  active:scale-95 transition-all duration-300 font-medium whitespace-nowrap
                  min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary
                  transform ${isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}
                  cursor-pointer
                `}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Fade out edges with stronger gradients for better visual cues */}
        <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-neutral-50 via-neutral-50/80 to-transparent pointer-events-none z-10"></div>
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-neutral-50 via-neutral-50/80 to-transparent pointer-events-none z-10"></div>

        {/* Scroll indicators for desktop */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 hidden md:block pointer-events-none">
          <div className="text-neutral-400 text-xs animate-pulse">← اسحب للمزيد</div>
        </div>
      </div>
    </div>
  );
}
