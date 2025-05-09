import React, { useState, useEffect, useRef } from 'react';

/**
 * AlertSlider
 * Props:
 *   alerts: Array of alert objects
 *   visibleCount: Number (default 4) - how many alerts to show at once
 *   preferences: Object containing user alert preferences (optional)
 */
const AlertSlider = ({ alerts, visibleCount = 4, preferences = null }) => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const scrollContainerRef = useRef(null);
  
  // Filter alerts based on user preferences if provided
  const filteredAlerts = React.useMemo(() => {
    if (!preferences || preferences.showAll) {
      return alerts;
    }
    
    return alerts.filter(alert => {
      // Convert API category to lowercase and normalize it
      const normalizedCategory = alert.category?.toLowerCase() || '';
      
      // Check if this category or something similar is in the user's preferences
      return preferences.categories.some(preferredCategory => {
        return normalizedCategory.includes(preferredCategory) || 
               preferredCategory.includes(normalizedCategory);
      });
    });
  }, [alerts, preferences]);
  
  // Get max alerts to display from preferences or use default
  const maxVisibleCount = preferences?.maxAlerts || visibleCount;
  
  // Limit alerts based on user preferences
  const limitedAlerts = filteredAlerts.slice(0, maxVisibleCount);

  // Scroll horizontally when arrow buttons are clicked
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={scrollLeft}
          className="px-3 py-2 rounded-full bg-gray-200 text-gray-700 shadow hover:bg-gray-300 transition z-10"
          aria-label="Scroll left"
        >
          &#8592;
        </button>
        
        <div
          ref={scrollContainerRef}
          className="flex-1 flex space-x-4 overflow-x-auto px-4 py-2"
          style={{ 
            scrollBehavior: 'smooth', 
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',  /* IE and Edge */
            scrollbarWidth: 'none',   /* Firefox */
            /* The ::webkit-scrollbar is handled in AboutPage's stylesheet */
          }}
        >

          {limitedAlerts.map((alert) => {
            // Prefer alert.url, else try a best-effort fallback to the NPS alert page for the park
            let alertLink = alert.url;
            if (!alertLink) {
              // Fallback: try to construct a sensible link to the park's alert page if parkCode exists
              if (alert.parkCode) {
                alertLink = `https://www.nps.gov/${alert.parkCode}/planyourvisit/conditions.htm`;
              } else {
                // If no parkCode, link to NPS alerts main page
                alertLink = 'https://www.nps.gov/subjects/alerts/index.htm';
              }
            }
            return (
              <a
                key={alert.id}
                href={alertLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedAlert(alert);
                }}
                className="block w-full max-w-xs bg-gradient-to-br from-yellow-100 to-yellow-50 border border-yellow-400 rounded-xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition transform duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400"
                style={{ minWidth: '280px' }}
              >
                <h3 className="font-bold text-lg text-yellow-900 mb-2 truncate">{alert.title}</h3>
                <p className="text-yellow-800 mb-2 line-clamp-3 min-h-[3.5em]">{alert.description}</p>
                <div className="text-xs text-gray-500 mb-1">
                  <span className="font-semibold">Category:</span> {alert.category}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  <span className="font-semibold">Park:</span> {alert.parkCode || 'Multiple'}
                </div>
                {alert.lastIndexedDate && (
                  <div className="text-xs text-gray-400">
                    {new Date(alert.lastIndexedDate).toLocaleString()}
                  </div>
                )}
              </a>
            );
          })}
        </div>
        <button
          onClick={scrollRight}
          className="px-3 py-2 rounded-full bg-gray-200 text-gray-700 shadow hover:bg-gray-300 transition z-10"
          aria-label="Scroll right"
        >
          &#8594;
        </button>
      </div>
      
      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedAlert(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="p-6 pt-4">
              <div className="mb-2">
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  {selectedAlert.category}
                </span>
                {selectedAlert.parkCode && (
                  <span className="inline-block ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {selectedAlert.parkCode}
                  </span>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedAlert.title}</h2>
              
              <div className="prose prose-sm max-w-none mb-6">
                {/* Display full description without truncation */}
                <p className="text-gray-700">{selectedAlert.description}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 border-t pt-4">
                <div>
                  {selectedAlert.lastIndexedDate && (
                    <p>Last updated: {new Date(selectedAlert.lastIndexedDate).toLocaleString()}</p>
                  )}
                </div>
                
                <div className="mt-2 sm:mt-0">
                  {/* External link button */}
                  {(selectedAlert.url || selectedAlert.parkCode) && (
                    <a
                      href={selectedAlert.url || `https://www.nps.gov/${selectedAlert.parkCode}/planyourvisit/conditions.htm`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      View on NPS website
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get user alert preferences
const getUserAlertPreferences = () => {
  try {
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) return null;
    
    const userDataString = localStorage.getItem(`user-${currentUserId}-preferences`);
    if (!userDataString) return null;
    
    const userData = JSON.parse(userDataString);
    return userData.alertPreferences || null;
  } catch (error) {
    console.error('Error retrieving user alert preferences:', error);
    return null;
  }
};

// Helper to immediately trigger a storage event to refresh preferences
const triggerStorageUpdate = () => {
  // Dispatch a storage event to notify other components about the change
  window.dispatchEvent(new Event('preferencesUpdated'));
};

// If using alert preferences, call this when setting in localStorage
window.updateAlertPreferences = () => {
  triggerStorageUpdate();
};

// Higher order component to automatically inject user preferences
export const AlertSliderWithPreferences = (props) => {
  const [preferences, setPreferences] = useState(null);
  
  // Force refresh of preferences
  const refreshPreferences = () => {
    const userPreferences = getUserAlertPreferences();
    console.log('Updated preferences:', userPreferences);
    setPreferences(userPreferences);
  };
  
  useEffect(() => {
    // Get user preferences on mount
    refreshPreferences();
    
    // Set up listener for preference changes
    const handleStorageChange = () => {
      refreshPreferences();
    };
    
    // Listen for both standard storage events and our custom event
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('preferencesUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('preferencesUpdated', handleStorageChange);
    };
  }, []);
  
  return <AlertSlider {...props} preferences={preferences} />;
};

export default AlertSlider;
