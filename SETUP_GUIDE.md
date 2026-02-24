# Setup and Build Guide

## Quick Start

### 1. Development Setup

Start the development server:

```bash
npm start
```

Then press:
- `a` - Open on Android emulator/device
- `i` - Open on iOS simulator (macOS only)
- `w` - Open in web browser

### 2. First Run

When you first run the app:

1. **Grant Permissions**: The app will request permissions for:
   - Contacts access
   - Media library access
   - Phone state (for SIM detection)

2. **Test Features**:
   - Browse contacts in the Contacts tab
   - View SIM settings in the SIM Cards tab
   - Explore ringtones in the Ringtones tab

## Building for Android

### Development Build

For testing with full native functionality:

```bash
npx expo prebuild --platform android
npx expo run:android
```

This will:
- Generate native Android code
- Install the app on your connected device/emulator
- Enable hot reloading

### Production Build

#### Option 1: EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Build for Android:
```bash
eas build --platform android
```

#### Option 2: Local Build

1. Prebuild the project:
```bash
npx expo prebuild
```

2. Open Android Studio:
```bash
cd android
studio .
```

3. Build the APK/AAB from Android Studio

## Building for iOS

**Note**: iOS has significant limitations for ringtone management. The app will have reduced functionality on iOS.

### Development Build

```bash
npx expo prebuild --platform ios
npx expo run:ios
```

### Production Build

```bash
eas build --platform ios
```

## Native Module Setup

### Android Native Module

The native Android module is located at:
```
modules/ringtone-native/android/src/main/java/expo/modules/ringtonenative/
```

It provides:
- Setting ringtones for specific contacts
- Setting default device ringtone
- Getting ringtone for a contact
- Permission management

### Testing Native Functionality

To test the native module:

1. Build the development client:
```bash
npx expo run:android
```

2. The native module will be automatically linked
3. Test ringtone assignment from the app

## Permissions Setup

### Android Permissions

Already configured in `app.json`:
- `READ_CONTACTS`
- `WRITE_CONTACTS`
- `READ_PHONE_STATE`
- `READ_EXTERNAL_STORAGE`
- `WRITE_EXTERNAL_STORAGE`
- `WRITE_SETTINGS`

### Runtime Permission Handling

The app handles runtime permissions for:
- Contacts (handled by `useContacts` hook)
- Media Library (handled by `RingtoneManager`)
- Write Settings (handled by native module)

## Troubleshooting

### Common Issues

#### 1. "RingtoneNative module not available"

This means you're running in Expo Go, which doesn't support custom native modules.

**Solution**: Build a development client:
```bash
npx expo run:android
```

#### 2. Contacts not loading

**Check**:
- Permission is granted in app settings
- Device has contacts
- `expo-contacts` is installed

**Solution**:
```bash
npm install expo-contacts
npx expo prebuild --clean
```

#### 3. Ringtones not setting on device

**Check**:
- Write Settings permission granted
- Using development build (not Expo Go)
- Android version is 6.0+

**Solution**:
- Go to Android Settings → Apps → Ringtone Manager → Permissions
- Enable "Modify system settings"

#### 4. Build errors

**Solution**:
```bash
# Clean and rebuild
npx expo prebuild --clean
cd android
./gradlew clean
cd ..
npx expo run:android
```

### Debug Mode

Enable debug logging:

```typescript
// Add to your app code
console.log('Debug mode enabled');
```

Check logs:
- Android: `npx react-native log-android`
- iOS: `npx react-native log-ios`

## Testing Checklist

Before releasing, test:

- [ ] Contact list loads correctly
- [ ] Search functionality works
- [ ] Can select ringtone for contact
- [ ] Ringtone persists after app restart
- [ ] SIM settings screen displays
- [ ] Can select ringtone for SIM
- [ ] Custom ringtone upload works
- [ ] Custom ringtone deletion works
- [ ] Dark mode works correctly
- [ ] Permissions are requested properly
- [ ] App doesn't crash on permission denial

## Performance Tips

1. **Large Contact Lists**: The app uses FlatList for efficient rendering
2. **Audio Files**: Keep ringtone files under 30 seconds for best performance
3. **Storage**: AsyncStorage is used for settings (very fast)

## App Configuration

### Change App Name

Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Change Package Name (Android)

Edit `app.json`:
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.ringtone"
    }
  }
}
```

Then rebuild:
```bash
npx expo prebuild --clean
```

### Change App Icon

Replace files in `assets/images/`:
- `icon.png` - 1024x1024
- `android-icon-foreground.png`
- `android-icon-background.png`

## Production Deployment

### Google Play Store

1. Build release AAB:
```bash
eas build --platform android --profile production
```

2. Sign up for Google Play Console

3. Upload the AAB file

4. Fill in store listing

5. Submit for review

### App Store (iOS)

1. Build release IPA:
```bash
eas build --platform ios --profile production
```

2. Upload to App Store Connect

3. Fill in app information

4. Submit for review

**Note**: Apple's review process is stricter and may have questions about limited ringtone functionality.

## Environment Variables

Create `.env` file for configuration:

```env
# API Keys (if needed in future)
API_KEY=your_api_key_here

# App Configuration
ENABLE_ANALYTICS=false
DEBUG_MODE=false
```

## Support

For issues:
1. Check this guide
2. Review logs
3. Check GitHub issues
4. Open a new issue with:
   - Device information
   - Android/iOS version
   - Error logs
   - Steps to reproduce

## Next Steps

After setup:
1. Customize the UI colors in `constants/theme.ts`
2. Add your app icon and splash screen
3. Test on real devices
4. Submit to app stores
5. Monitor user feedback
6. Plan feature updates

Good luck with your app! 🎵📱
