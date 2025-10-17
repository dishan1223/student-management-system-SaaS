// Navbar Component
function Navbar({ isLoggedIn = false, onLogout = null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {CONFIG.branding.useTextLogo ? (
              <>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  <span className="text-blue-500">i</span>{CONFIG.branding.name}
                </span>
              </>
            ) : (
              <img 
                src={CONFIG.branding.logo} 
                alt={CONFIG.branding.name}
                className="h-8 w-auto"
              />
            )}
          </div>
          
          {/* Desktop Menu */}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-3">
              <a
                href="/upgrade"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
              >
                Purchase
              </a>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm border border-gray-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-700 hover:text-gray-900 font-medium">HOME</a>
              <a href="#pricing" className="text-gray-700 hover:text-gray-900 font-medium">PRICING</a>
              <a href="#about" className="text-gray-700 hover:text-gray-900 font-medium">ABOUT US</a>
              <a href="/sign-in" className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg">
                Login
              </a>
              <a href="/sign-up" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Get Started
              </a>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {isLoggedIn ? (
              <>
                <a href="/upgrade" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Purchase
                </a>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="#home" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">HOME</a>
                <a href="#pricing" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">PRICING</a>
                <a href="#about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">ABOUT US</a>
                <a href="/sign-in" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300">
                  Login
                </a>
                <a href="/sign-up" className="block px-4 py-2 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600">
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}