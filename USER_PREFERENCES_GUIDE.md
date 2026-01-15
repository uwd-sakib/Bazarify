# User Preferences System - Integration Guide

## Overview

The Bazarify platform now includes a comprehensive user preferences system that allows users to customize their experience with language and theme settings. These preferences are stored both locally (localStorage) and in the backend database, ensuring a consistent experience across devices and sessions.

## Features

### 1. Language Preference
- **Supported Languages**: Bangla (bn), English (en)
- **Default**: Bangla (bn)
- **Storage**: localStorage + MongoDB
- **Auto-sync**: Changes are automatically synced to the backend

### 2. Theme Preference
- **Supported Themes**: 
  - `light` - Light mode
  - `dark` - Dark mode
  - `system` - Follow system preference
- **Default**: system
- **Storage**: localStorage + MongoDB
- **Auto-sync**: Changes are automatically synced to the backend

## Architecture

### Backend

#### 1. User Model Extension
```javascript
// backend/src/models/User.js
preferences: {
  language: {
    type: String,
    enum: ['bn', 'en'],
    default: 'bn'
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system'
  }
}
```

#### 2. API Endpoints

**Get User Preferences**
```
GET /api/auth/preferences
Headers: { Authorization: "Bearer <token>" }

Response:
{
  "success": true,
  "data": {
    "preferences": {
      "language": "bn",
      "theme": "system"
    }
  }
}
```

**Update User Preferences**
```
PUT /api/auth/preferences
Headers: { Authorization: "Bearer <token>" }
Body: {
  "language": "en",
  "theme": "dark"
}

Response:
{
  "success": true,
  "message": "পছন্দসমূহ সফলভাবে আপডেট হয়েছে",
  "data": {
    "preferences": {
      "language": "en",
      "theme": "dark"
    }
  }
}
```

**Login Response (includes preferences)**
```
POST /api/auth/login
Body: { "email": "user@example.com", "password": "password123" }

Response:
{
  "success": true,
  "message": "সফলভাবে লগইন হয়েছে",
  "data": {
    "user": {
      "id": "...",
      "name": "...",
      "email": "...",
      "role": "merchant",
      "shopId": "...",
      "preferences": {
        "language": "bn",
        "theme": "system"
      }
    },
    "shop": { ... },
    "token": "..."
  }
}
```

### Frontend

#### 1. Context Providers

**LanguageContext**
- Manages language state
- Provides translation function `t(key)`
- Syncs changes with backend
- Listens for changes from AuthContext

**ThemeContext**
- Manages theme state
- Applies theme to DOM (dark class)
- Syncs changes with backend
- Supports system preference detection
- Listens for changes from AuthContext

**AuthContext**
- Manages authentication state
- Syncs preferences on login/register
- Provides `updateUserPreferences()` method
- Dispatches events to LanguageContext and ThemeContext

#### 2. Data Flow

```
User Action (Login/Register)
    ↓
AuthContext receives user data with preferences
    ↓
AuthContext stores preferences in localStorage
    ↓
AuthContext dispatches custom events:
  - 'languageChange' event
  - 'themeChange' event
    ↓
LanguageContext listens and updates language
ThemeContext listens and updates theme
    ↓
UI updates automatically
```

#### 3. Preference Updates

```
User changes language/theme via toggle
    ↓
LanguageContext/ThemeContext updates local state
    ↓
Context calls authService.updatePreferences()
    ↓
Backend API saves to database
    ↓
localStorage is updated
    ↓
UI reflects the change
```

## Usage Examples

### For Developers

#### 1. Using Language in Components
```jsx
import { useTranslation } from '../context/LanguageContext';

function MyComponent() {
  const { t, language, changeLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('common.current_language')}: {language}</p>
      <button onClick={() => changeLanguage('en')}>
        Switch to English
      </button>
    </div>
  );
}
```

#### 2. Using Theme in Components
```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { theme, isDark, toggleTheme, setLightTheme, setDarkTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Is dark mode: {isDark ? 'Yes' : 'No'}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={setLightTheme}>Light</button>
      <button onClick={setDarkTheme}>Dark</button>
    </div>
  );
}
```

#### 3. Manually Updating Preferences via AuthContext
```jsx
import { useAuth } from '../context/AuthContext';

function SettingsComponent() {
  const { user, updateUserPreferences } = useAuth();
  
  const savePreferences = async () => {
    try {
      await updateUserPreferences({
        language: 'en',
        theme: 'dark'
      });
      console.log('Preferences saved!');
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };
  
  return (
    <div>
      <p>Current language: {user?.preferences?.language}</p>
      <p>Current theme: {user?.preferences?.theme}</p>
      <button onClick={savePreferences}>Save</button>
    </div>
  );
}
```

## Storage Details

### localStorage Keys
- `token` - JWT authentication token
- `user` - User object (includes preferences)
- `shop` - Shop object
- `language` - Current language preference
- `theme` - Current theme preference

### MongoDB Structure
```javascript
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  password: "...",
  role: "merchant",
  shopId: ObjectId("..."),
  preferences: {
    language: "bn",
    theme: "system"
  },
  isActive: true,
  createdAt: "...",
  updatedAt: "..."
}
```

## Synchronization Strategy

### On Login/Register
1. Backend returns user with preferences
2. AuthContext saves to localStorage
3. AuthContext dispatches custom events
4. LanguageContext and ThemeContext update their states
5. UI reflects user's saved preferences

### On Preference Change
1. User clicks language/theme toggle
2. Context updates local state (instant UI update)
3. Context calls backend API to save
4. Backend validates and saves to MongoDB
5. Response confirms save
6. If API fails, UI already updated (optimistic update)

### On Logout
1. Clear all localStorage
2. Reset contexts to defaults
3. User preferences remain in database
4. On next login, preferences are restored

## Testing the Integration

### 1. Test Language Persistence
```bash
# 1. Login to the application
# 2. Change language to English
# 3. Refresh the page
# Expected: Language remains English

# 4. Logout and login again
# Expected: Language is English (loaded from database)
```

### 2. Test Theme Persistence
```bash
# 1. Login to the application
# 2. Change theme to Dark
# 3. Refresh the page
# Expected: Theme remains Dark

# 4. Logout and login again
# Expected: Theme is Dark (loaded from database)
```

### 3. Test Cross-Device Sync
```bash
# 1. Login on Device A
# 2. Change language to English and theme to Dark
# 3. Login on Device B with same account
# Expected: Language is English, theme is Dark
```

## API Validation

### Language Validation
```javascript
// Allowed values: 'bn', 'en'
// Invalid request:
PUT /api/auth/preferences
{ "language": "fr" }

// Response:
{
  "success": false,
  "message": "অবৈধ ভাষা নির্বাচন"
}
```

### Theme Validation
```javascript
// Allowed values: 'light', 'dark', 'system'
// Invalid request:
PUT /api/auth/preferences
{ "theme": "custom" }

// Response:
{
  "success": false,
  "message": "অবৈধ থিম নির্বাচন"
}
```

## Migration Notes

### Existing Users
- Users created before this feature will have default preferences:
  - language: 'bn'
  - theme: 'system'
- No migration script needed (defaults handled in code)

### Backward Compatibility
- Old localStorage keys (`bazarify_language`, `bazarify_theme`) are replaced with:
  - `language`
  - `theme`
- First login after update will migrate user to new system

## Troubleshooting

### Preferences not syncing
1. Check if user is authenticated (token exists)
2. Check browser console for API errors
3. Verify backend is running
4. Check MongoDB connection

### Theme not applying
1. Verify Tailwind config has `darkMode: 'class'`
2. Check if `dark` class is added to `<html>` element
3. Verify CSS is properly built

### Language not changing
1. Check if translation files exist
2. Verify keys exist in both `bn.json` and `en.json`
3. Check browser console for errors

## Future Enhancements

- [ ] Add more languages (Hindi, Arabic, etc.)
- [ ] Add more theme options (high contrast, custom colors)
- [ ] Add font size preference
- [ ] Add layout density preference (compact/comfortable)
- [ ] Add date/time format preference
- [ ] Add currency display preference

## Summary

This user preferences system provides a seamless, synchronized experience across the application. It combines the speed of local storage with the reliability of database persistence, ensuring users get their preferred settings instantly while maintaining consistency across devices and sessions.
