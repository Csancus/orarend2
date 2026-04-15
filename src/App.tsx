import { useState } from 'react';
import { CalendarDays, Menu, X } from 'lucide-react';
import { ChildList } from './components/children/ChildList';
import { CalendarView } from './components/calendar/CalendarView';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-gray-100"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <CalendarDays size={22} className="text-blue-500" />
        <h1 className="text-lg font-semibold text-gray-800 m-0">Órarend</h1>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={`
            border-r border-gray-200 bg-white p-4 transition-all duration-200 flex-shrink-0
            fixed lg:relative z-40 h-[calc(100%-53px)] top-[53px] lg:top-0 lg:h-auto
            ${sidebarOpen ? 'w-72 lg:w-64' : 'w-0 overflow-hidden p-0'}
            shadow-lg lg:shadow-none
          `}
        >
          <ChildList />
        </aside>

        {/* Calendar */}
        <CalendarView />
      </div>
    </div>
  );
}

export default App;
