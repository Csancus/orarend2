import { useState } from 'react';
import { CalendarDays, Menu, X } from 'lucide-react';
import { ChildList } from './components/children/ChildList';
import { CalendarView } from './components/calendar/CalendarView';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-gray-100 lg:hidden"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <CalendarDays size={22} className="text-blue-500" />
        <h1 className="text-lg font-semibold text-gray-800 m-0">Órarend</h1>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}
            border-r border-gray-200 bg-gray-50 p-4 transition-all duration-200
            max-lg:absolute max-lg:z-40 max-lg:h-[calc(100%-53px)] max-lg:top-[53px] max-lg:bg-white max-lg:shadow-lg
            ${!sidebarOpen && 'max-lg:p-0'}
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
