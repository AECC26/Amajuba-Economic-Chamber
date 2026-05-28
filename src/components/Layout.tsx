import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingChatButton from './FloatingChatButton';

export default function Layout() {
  const { pathname } = useLocation();
  const isChat = pathname === '/chat';

  return (
    <div className={`flex flex-col ${isChat ? 'min-h-0' : 'min-h-screen'}`}>
      <Navbar />
      <main className={isChat ? 'flex-1 min-h-0 flex flex-col' : 'flex-grow'}>
        <Outlet />
      </main>
      {!isChat && <Footer />}
      {!isChat && <FloatingChatButton />}
    </div>
  );
}
