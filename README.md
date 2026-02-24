# Ringtone Manager App

A React Native (Expo) application that allows users to set custom ringtones for individual contacts and SIM cards.

## Features

- 📱 **Per-Contact Ringtones**: Assign unique ringtones to specific contacts
- 📡 **Dual SIM Support**: Set different ringtones for each SIM card
- 🎵 **Ringtone Library**: Browse system ringtones and add custom audio files
- 💾 **Persistent Storage**: All settings are saved locally
- 🎨 **Modern UI**: Beautiful, intuitive interface with dark mode support
- 🔍 **Contact Search**: Quickly find contacts with search functionality

## Tech Stack

- **React Native** with **Expo**
- **TypeScript**
- **Expo Router** for navigation
- **AsyncStorage** for data persistence
- **Expo Contacts** for contact access
- **Expo Media Library** for audio file management
- **Native Android Module** for ringtone assignment

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ringtone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on Android:
```bash
npm run android
```

5. Run on iOS:
```bash
npm run ios
```

## Project Structure

```
ringtone/
├── app/                      # App screens and navigation
│   ├── (tabs)/              # Tab-based navigation
│   │   ├── index.tsx        # Contacts screen
│   │   ├── sim-settings.tsx # SIM card settings
│   │   └── ringtones.tsx    # Ringtone library
│   ├── contact-detail.tsx   # Contact detail with ringtone assignment
│   └── ringtone-picker.tsx  # Ringtone selection modal
├── components/              # Reusable UI components
├── hooks/                   # Custom React hooks
│   ├── useContacts.ts      # Contact management
│   ├── useRingtones.ts     # Ringtone management
│   └── useSIMCards.ts      # SIM card detection
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
│   ├── storage.ts          # AsyncStorage wrapper
│   └── ringtoneManager.ts  # Ringtone operations
└── modules/                 # Native modules
    └── ringtone-native/    # Android native module

```

## Permissions

The app requires the following permissions:

### Android
- `READ_CONTACTS` - Read contact information
- `WRITE_CONTACTS` - Modify contact ringtones
- `READ_PHONE_STATE` - Detect SIM cards
- `READ_EXTERNAL_STORAGE` - Access audio files
- `WRITE_EXTERNAL_STORAGE` - Save custom ringtones
- `WRITE_SETTINGS` - Set device ringtones

### iOS
- Contacts access (limited functionality due to iOS restrictions)
- Media Library access

**Note**: iOS does not support setting custom ringtones per contact programmatically. The app will have limited functionality on iOS.

## Usage

### Setting a Contact Ringtone

1. Navigate to the **Contacts** tab
2. Search or scroll to find a contact
3. Tap on the contact
4. Select a ringtone from the list
5. The ringtone is automatically saved

### Setting a SIM Card Ringtone

1. Navigate to the **SIM Cards** tab
2. Tap on a SIM card
3. Select a ringtone from the list
4. The ringtone is automatically saved

### Adding Custom Ringtones

1. Navigate to the **Ringtones** tab
2. Tap the **+** button
3. Select an audio file from your device
4. The ringtone is added to your library

### Removing Custom Ringtones

1. Navigate to the **Ringtones** tab
2. Find a custom ringtone (marked with "Custom")
3. Tap the trash icon
4. Confirm deletion

## Building for Production

### Android

1. Generate the Android app bundle:
```bash
npx expo build:android
```

2. Or create a development build:
```bash
npx expo run:android --variant release
```

### iOS

1. Generate the iOS app:
```bash
npx expo build:ios
```

## Known Limitations

- **iOS**: Cannot set per-contact ringtones programmatically (iOS limitation)
- **iOS**: Cannot set default device ringtone programmatically
- **Android**: Requires Android 6.0+ for full functionality
- **SIM Detection**: Currently uses mock data; real SIM detection requires additional native implementation

## Future Enhancements

- [ ] Real SIM card detection using native modules
- [ ] Ringtone preview/playback
- [ ] Vibration pattern customization
- [ ] Notification sound customization
- [ ] Export/import settings
- [ ] Cloud backup integration
- [ ] Contact groups with shared ringtones
- [ ] Ringtone trimmer/editor

## Troubleshooting

### Contacts not loading
- Ensure you've granted contacts permission
- Check that Expo Contacts is properly installed

### Ringtones not setting
- Ensure you've granted write settings permission on Android
- Check that the audio file format is supported

### App crashes on Android
- Run `npx expo prebuild --clean` to regenerate native files
- Check Android Studio logs for detailed errors

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- Expo team for the amazing framework
- React Native community for excellent libraries
- All contributors to this project
