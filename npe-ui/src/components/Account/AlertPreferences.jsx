import React, { useState, useEffect } from 'react';

/**
 * AlertPreferences Component
 * Allows users to customize which types of alerts they want to see
 */
const AlertPreferences = ({ savedPreferences, onPreferencesChange }) => {
  // Alert categories from NPS API documentation
  const alertCategories = [
    { id: 'park-closure', label: 'Park Closure', description: 'Notifications about full or partial park closures' },
    { id: 'danger', label: 'Danger', description: 'Alerts about immediate safety concerns' },
    { id: 'caution', label: 'Caution', description: 'Warnings about potential hazards or concerns' },
    { id: 'information', label: 'Information', description: 'General park information and updates' },
    { id: 'weather', label: 'Weather', description: 'Weather-related alerts and warnings' }
  ];

  // Initialize with saved preferences or default (all selected)
  const [preferences, setPreferences] = useState(savedPreferences || {
    categories: alertCategories.map(cat => cat.id),
    showAll: true,
    maxAlerts: 5
  });

  // Handle checkbox changes for individual categories
  const handleCategoryChange = (categoryId) => {
    const updatedCategories = [...preferences.categories];
    
    if (updatedCategories.includes(categoryId)) {
      // Remove category if already selected
      const index = updatedCategories.indexOf(categoryId);
      updatedCategories.splice(index, 1);
    } else {
      // Add category if not selected
      updatedCategories.push(categoryId);
    }

    const newPreferences = { 
      ...preferences, 
      categories: updatedCategories,
      showAll: false // Auto-disable show all when individual selection is made
    };
    
    setPreferences(newPreferences);
    onPreferencesChange(newPreferences);
  };

  // Handle toggle for showing all alerts
  const handleShowAllChange = (e) => {
    const showAll = e.target.checked;
    const newPreferences = {
      ...preferences,
      showAll,
      // If showAll is true, select all categories
      categories: showAll ? alertCategories.map(cat => cat.id) : preferences.categories
    };
    
    setPreferences(newPreferences);
    onPreferencesChange(newPreferences);
  };

  // Handle number of alerts to display
  const handleMaxAlertsChange = (e) => {
    const maxAlerts = parseInt(e.target.value, 10);
    const newPreferences = { ...preferences, maxAlerts };
    setPreferences(newPreferences);
    onPreferencesChange(newPreferences);
  };

  useEffect(() => {
    // Update component state if parent provides new saved preferences
    if (savedPreferences) {
      setPreferences(savedPreferences);
    }
  }, [savedPreferences]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Alert Preferences</h3>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="show-all-alerts"
            checked={preferences.showAll}
            onChange={handleShowAllChange}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="show-all-alerts" className="ml-2 text-gray-700 font-medium">
            Show all alerts
          </label>
        </div>
        <p className="text-sm text-gray-500 ml-6">Receive notifications for all alert types</p>
      </div>

      {!preferences.showAll && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Select alert categories you want to see:</p>
          <div className="space-y-2 ml-2">
            {alertCategories.map(category => (
              <div key={category.id} className="flex items-start">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={preferences.categories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="h-4 w-4 mt-1 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <div className="ml-2">
                  <label htmlFor={`category-${category.id}`} className="text-gray-700 font-medium">
                    {category.label}
                  </label>
                  <p className="text-xs text-gray-500">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="max-alerts" className="block text-sm font-medium text-gray-700 mb-1">
          Maximum alerts to display
        </label>
        <select
          id="max-alerts"
          value={preferences.maxAlerts}
          onChange={handleMaxAlertsChange}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <option value="3">3 alerts</option>
          <option value="5">5 alerts</option>
          <option value="10">10 alerts</option>
          <option value="15">15 alerts</option>
        </select>
      </div>
    </div>
  );
};

export default AlertPreferences;
