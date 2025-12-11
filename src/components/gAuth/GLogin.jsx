import { useState } from 'react';
import { Phone, Lock } from 'lucide-react';

export default function GLogin() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [passkey, setPasskey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (!phoneNumber ) {
      setError('Please fill in all fields');
      return;
    }


    setIsLoading(true);

    try {
      const response = await fetch('/api/guardian/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token on success
      localStorage.setItem('guardianToken', data.token);

      // Refresh the page
      window.location.reload();

    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Guardian Portal</h1>
            <p className="text-gray-500 text-xs sm:text-sm">Sign in to access student information</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="phone_number" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Student's Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="block w-full bg-gray-50 pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all outline-none text-gray-900"
                  placeholder="01234567890"
                />
              </div>
            </div>

            

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 sm:py-3 px-4 text-sm sm:text-base rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-5"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              Log in with the number given to the teacher
            </p>
          </div>
        </div>

        <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
          Need help? <button onClick={()=>{
            window.location.href="https://mail.google.com/mail/?view=cm&fs=1&to=loomsoftwares@gmail.com";
          }
          } className="text-emerald-600 hover:text-emerald-700 font-medium">Contact Support</button>
        </p>
      </div>
    </div>
  );
}
