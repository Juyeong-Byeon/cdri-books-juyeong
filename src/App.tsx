import { useState } from 'react';

export function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'favorites'>('search');

  return (
    <div className="min-h-screen bg-palette-white">
      {/* GNB Header */}
      <header className="border-b border-palette-gray">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-title1 font-bold text-text-primary tracking-tight">CERTICOS BOOKS</h1>

          <nav className="flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`pb-4 pt-4 text-body1 font-medium transition-colors relative ${
                activeTab === 'search'
                  ? 'text-palette-primary font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-palette-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              도서 검색
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={`pb-4 pt-4 text-body1 font-medium transition-colors relative ${
                activeTab === 'favorites'
                  ? 'text-palette-primary font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-palette-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              내가 찜한 책
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-title2 text-text-primary mb-2">
            {activeTab === 'search' ? '도서 검색' : '내가 찜한 책'}
          </h2>
          <p className="text-body2 text-text-secondary">
            프로젝트 초기 셋업이 정상적으로 완료되었습니다.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
