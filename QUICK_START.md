# Quick Start Guide

## Run the App (Development)

```bash
# Start development server
npm start

# Then press 'a' for Android or 'i' for iOS
```

## App Structure

### 📱 Main Screens

1. **Contacts Tab** - View and manage contact ringtones
2. **SIM Cards Tab** - Configure ringtones per SIM
3. **Ringtones Tab** - Browse and manage ringtone library

### 🎯 Key Features

- **Per-Contact Ringtones**: Tap any contact → Select ringtone
- **Per-SIM Ringtones**: Go to SIM Cards tab → Select SIM → Choose ringtone
- **Custom Ringtones**: Ringtones tab → Press + button → Select audio file
- **Search Contacts**: Use search bar on Contacts tab
- **Delete Custom Ringtones**: Tap trash icon on custom ringtones

## First Time Setup

1. **Grant Permissions**: Allow contacts and media access when prompted
2. **Add Contacts**: Sync contacts from your device (automatic)
3. **Browse Ringtones**: Check out available system ringtones
4. **Test Assignment**: Assign a ringtone to a test contact

## File Structure

```
app/
  (tabs)/
    index.tsx         - Contacts screen
    sim-settings.tsx  - SIM configuration
    ringtones.tsx     - Ringtone library
  contact-detail.tsx  - Contact details & ringtone selection
  ringtone-picker.tsx - Ringtone picker modal

hooks/
  useContacts.ts      - Contact management
  useRingtones.ts     - Ringtone management
  useSIMCards.ts      - SIM card detection

utils/
  storage.ts          - AsyncStorage operations
  ringtoneManager.ts  - Ringtone file operations

types/
  index.ts            - TypeScript definitions

modules/
  ringtone-native/    - Native Android module
```

## Common Commands

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Build development version
npx expo run:android

# Clean and rebuild
npx expo prebuild --clean
```

## Important Notes

### ⚠️ Platform Limitations

- **Android**: Full functionality ✅
- **iOS**: Limited (cannot set per-contact ringtones programmatically) ⚠️

### 📝 Permissions Required

- Contacts (read/write)
- Media Library (read)
- Phone State (SIM detection)
- Write Settings (Android)

### 🔧 Native Module

The native Android module requires a **development build**, not Expo Go:

```bash
npx expo run:android
```

## Testing

### Test Contact Ringtone
1. Open Contacts tab
2. Tap a contact
3. Select a ringtone
4. Call that contact to test

### Test SIM Ringtone
1. Open SIM Cards tab
2. Tap a SIM card
3. Select a ringtone
4. Call that SIM to test

### Test Custom Ringtone
1. Open Ringtones tab
2. Tap + button
3. Select an audio file (MP3, M4A, etc.)
4. Assign to a contact

## Troubleshooting

**No contacts showing?**
→ Grant contacts permission in app settings

**Can't set ringtone?**
→ Make sure you're using a development build (`npx expo run:android`)

**App crashes?**
→ Check logs: `npx react-native log-android`

**Ringtone not saving?**
→ Grant "Modify system settings" permission in Android settings

## Next Steps

1. ✅ Test all features
2. 🎨 Customize colors in `constants/theme.ts`
3. 📱 Add your app icon in `assets/images/`
4. 🚀 Build for production: `eas build`
5. 📦 Submit to Google Play Store

## Need Help?

- Check `README.md` for detailed documentation
- Check `SETUP_GUIDE.md` for build instructions
- Open an issue on GitHub

---

**Happy ringtone managing! 🎵**
