import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleNewChat = () => {
    navigate('/chat');
  };

  const handleChats = () => {
    navigate('/chat');
  };

  const handleLearn = () => {
    navigate('/learn');
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
          onClick={handleNewChat}
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
            alt="محادثة جديدة"
            style={{
              borderColor: 'rgb(0, 0, 0)',
              color: 'rgb(0, 0, 0)',
              cursor: 'pointer',
              fontFamily: 'arial',
              fontSize: '13.3333px',
              height: '20px',
              lineHeight: 'normal',
              opacity: 0.8,
              outlineColor: 'rgb(0, 0, 0)',
              overflowClipMargin: 'content-box',
              overflowX: 'clip',
              overflowY: 'clip',
              pointerEvents: 'none',
              textAlign: 'center',
              textDecorationColor: 'rgb(0, 0, 0)',
              textEmphasisColor: 'rgb(0, 0, 0)',
              transitionBehavior: 'normal, normal',
              transitionDelay: '0s, 0s',
              transitionDuration: '0.2s, 0.3s',
              transitionProperty: 'opacity, filter',
              transitionTimingFunction: 'ease, ease',
              width: '20px'
            }}
          />
        </button>

        {/* Chats Icon */}
        <div
          className="cursor-pointer flex justify-center relative"
          style={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <img
            src="https://storage.googleapis.com/tutory-assets/chats.png"
            alt="المحادثات"
            style={{
              cursor: 'pointer',
              height: '21px',
              opacity: 0.6,
              overflowClipMargin: 'content-box',
              overflowX: 'clip',
              overflowY: 'clip',
              pointerEvents: 'none',
              transitionBehavior: 'normal, normal',
              transitionDelay: '0s, 0s',
              transitionDuration: '0.2s, 0.3s',
              transitionProperty: 'opacity, filter',
              transitionTimingFunction: 'ease, ease',
              width: '21px'
            }}
          />
          <div
            className="hidden"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderBottomLeftRadius: '4px',
              borderBottomRightRadius: '4px',
              borderColor: 'rgb(255, 255, 255)',
              borderRadius: '4px',
              borderTopLeftRadius: '4px',
              borderTopRightRadius: '4px',
              color: 'rgb(255, 255, 255)',
              cursor: 'pointer',
              display: 'none',
              fontSize: '12px',
              left: '100%',
              lineHeight: '19.2px',
              marginLeft: '8px',
              marginTop: '8px',
              opacity: 0,
              outlineColor: 'rgb(255, 255, 255)',
              paddingBottom: '4px',
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '4px',
              pointerEvents: 'none',
              position: 'absolute',
              textDecorationColor: 'rgb(255, 255, 255)',
              textEmphasisColor: 'rgb(255, 255, 255)',
              textWrap: 'nowrap',
              top: '50%',
              transformOrigin: '0% 50%',
              transitionBehavior: 'normal, normal, normal',
              transitionDelay: '0s, 0.2s, 0s, 0s',
              transitionDuration: '0.2s, 0.3s, 0.3s',
              transitionProperty: 'opacity, visibility, transform, background-color, color',
              transitionTimingFunction: 'ease, ease, ease',
              visibility: 'hidden',
              whiteSpace: 'nowrap',
              zIndex: 100
            }}
          >
            المحادثات
          </div>
        </div>

        {/* Learn Icon */}
        <div
          className="cursor-pointer flex justify-center relative"
          style={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <img
            src="https://storage.googleapis.com/tutory-assets/learn.png"
            alt="تعلم"
            style={{
              cursor: 'pointer',
              height: '21px',
              opacity: 0.6,
              overflowClipMargin: 'content-box',
              overflowX: 'clip',
              overflowY: 'clip',
              pointerEvents: 'none',
              transitionBehavior: 'normal, normal',
              transitionDelay: '0s, 0s',
              transitionDuration: '0.2s, 0.3s',
              transitionProperty: 'opacity, filter',
              transitionTimingFunction: 'ease, ease',
              width: '21px'
            }}
          />
          <div
            className="hidden"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderBottomLeftRadius: '4px',
              borderBottomRightRadius: '4px',
              borderColor: 'rgb(255, 255, 255)',
              borderRadius: '4px',
              borderTopLeftRadius: '4px',
              borderTopRightRadius: '4px',
              color: 'rgb(255, 255, 255)',
              cursor: 'pointer',
              display: 'none',
              fontSize: '12px',
              left: '100%',
              lineHeight: '19.2px',
              marginLeft: '8px',
              marginTop: '8px',
              opacity: 0,
              outlineColor: 'rgb(255, 255, 255)',
              paddingBottom: '4px',
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '4px',
              pointerEvents: 'none',
              position: 'absolute',
              textDecorationColor: 'rgb(255, 255, 255)',
              textEmphasisColor: 'rgb(255, 255, 255)',
              textWrap: 'nowrap',
              top: '50%',
              transformOrigin: '0% 50%',
              transitionBehavior: 'normal, normal, normal',
              transitionDelay: '0s, 0.2s, 0s, 0s',
              transitionDuration: '0.2s, 0.3s, 0.3s',
              transitionProperty: 'opacity, visibility, transform, background-color, color',
              transitionTimingFunction: 'ease, ease, ease',
              visibility: 'hidden',
              whiteSpace: 'nowrap',
              zIndex: 100
            }}
          >
            تعلم
          </div>
        </div>
      </nav>

      {/* Theme Toggle Button at Bottom */}
      <div
        style={{
          marginTop: 'auto',
          paddingBottom: '10px'
        }}
      >
        <button
          aria-label="تبديل السمة"
          onClick={toggleTheme}
          style={{
            alignItems: 'center',
            appearance: 'auto',
            borderColor: 'rgb(0, 0, 0)',
            color: 'rgb(0, 0, 0)',
            cursor: 'pointer',
            display: 'flex',
            fontFamily: 'arial',
            fontSize: '13.3333px',
            justifyContent: 'center',
            lineHeight: 'normal',
            outlineColor: 'rgb(0, 0, 0)',
            paddingBottom: '5px',
            paddingLeft: '5px',
            paddingRight: '5px',
            paddingTop: '5px',
            textAlign: 'center',
            textDecorationColor: 'rgb(0, 0, 0)',
            textEmphasisColor: 'rgb(0, 0, 0)',
            backgroundColor: 'rgba(0, 0, 0, 0)'
          }}
        >
          <img
            src="https://storage.googleapis.com/tutory-assets/moon.png"
            alt="التبديل إلى الوضع المظلم"
            style={{
              borderColor: 'rgb(0, 0, 0)',
              color: 'rgb(0, 0, 0)',
              cursor: 'pointer',
              fontFamily: 'arial',
              fontSize: '13.3333px',
              height: '20px',
              lineHeight: 'normal',
              opacity: 0.6,
              outlineColor: 'rgb(0, 0, 0)',
              overflowClipMargin: 'content-box',
              overflowX: 'clip',
              overflowY: 'clip',
              textAlign: 'center',
              textDecorationColor: 'rgb(0, 0, 0)',
              textEmphasisColor: 'rgb(0, 0, 0)',
              transitionBehavior: 'normal, normal',
              transitionDelay: '0s, 0s',
              transitionDuration: '0.2s, 0.3s',
              transitionProperty: 'opacity, filter',
              transitionTimingFunction: 'ease, ease',
              width: '20px'
            }}
          />
        </button>
      </div>
    </aside>
  );
}
