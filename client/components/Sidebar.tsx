import { useState } from "react";

export default function Sidebar() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <aside
      className="w-[55px] h-screen flex flex-col items-center py-[25px] shrink-0 relative z-20 border-l border-solid border-l-[rgb(239,238,238)] dark:border-l-[hsl(var(--tutory-border))]"
      style={{
        backgroundColor: 'rgb(253, 248, 241)',
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        flexDirection: 'column',
        flexFlow: 'column nowrap',
        flexShrink: 0,
        paddingBottom: '25px',
        paddingTop: '25px',
        position: 'relative',
        transitionBehavior: 'normal, normal',
        transitionDelay: '0s, 0s',
        transitionDuration: '0.3s, 0.3s',
        transitionProperty: 'background-color, border-color',
        transitionTimingFunction: 'ease, ease',
        width: '55px',
        zIndex: 20,
      }}
    >
      <nav
        className="flex flex-col items-center"
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          flexFlow: 'column nowrap',
          gap: '25px',
          gridGap: '25px',
          gridRowGap: '25px',
          rowGap: '25px'
        }}
      >
        {/* New Chat Button */}
        <button
          aria-label="محادثة جديدة"
          className="flex items-center justify-center cursor-pointer"
          style={{
            alignItems: 'center',
            appearance: 'auto',
            backgroundColor: 'rgb(252, 199, 81)',
            borderBottomLeftRadius: '50%',
            borderBottomRightRadius: '50%',
            borderColor: 'rgb(0, 0, 0)',
            borderRadius: '50%',
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            color: 'rgb(0, 0, 0)',
            cursor: 'pointer',
            display: 'flex',
            fontFamily: 'arial',
            fontSize: '13.3333px',
            height: '27px',
            justifyContent: 'center',
            lineHeight: 'normal',
            marginBottom: '10px',
            outlineColor: 'rgb(0, 0, 0)',
            textAlign: 'center',
            textDecorationColor: 'rgb(0, 0, 0)',
            textEmphasisColor: 'rgb(0, 0, 0)',
            transitionBehavior: 'normal, normal',
            transitionDelay: '0s, 0s',
            transitionDuration: '0.2s, 0.1s',
            transitionProperty: 'background-color, transform',
            transitionTimingFunction: 'ease, ease',
            width: '27px'
          }}
        >
          <img 
            src="https://storage.googleapis.com/tutory-assets/add.png"
            alt="محا��ثة جديدة"
            className="w-5 h-5 opacity-80 pointer-events-none transition-all duration-200 ease-in-out"
          />
        </button>

        {/* Chats Icon */}
        <div className="relative flex justify-center cursor-pointer group">
          <img 
            src="https://storage.googleapis.com/tutory-assets/chats.png"
            alt="المحادثات"
            className="w-[21px] h-[21px] opacity-60 pointer-events-none transition-all duration-200 ease-in-out group-hover:opacity-100"
          />
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 mt-2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 delay-200 z-[100] pointer-events-none">
            المحادثات
          </div>
        </div>

        {/* Learn Icon */}
        <div className="relative flex justify-center cursor-pointer group">
          <img 
            src="https://storage.googleapis.com/tutory-assets/learn.png"
            alt="تعلم"
            className="w-[21px] h-[21px] opacity-60 pointer-events-none transition-all duration-200 ease-in-out group-hover:opacity-100"
          />
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 mt-2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 delay-200 z-[100] pointer-events-none">
            تعلم
          </div>
        </div>
      </nav>

      {/* Theme Toggle Button at Bottom */}
      <div className="mt-auto pb-[10px]">
        <button 
          aria-label="تبديل السمة"
          onClick={toggleTheme}
          className="flex items-center justify-center p-[5px] bg-transparent cursor-pointer"
        >
          <img 
            src="https://storage.googleapis.com/tutory-assets/moon.png"
            alt="التبديل إلى الوضع المظلم"
            className="w-5 h-5 opacity-60 transition-all duration-200 ease-in-out hover:opacity-100"
          />
        </button>
      </div>
    </aside>
  );
}
