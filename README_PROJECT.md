# QRoot - Parking Violation Reporter

A mobile-first Angular 19 application for reporting parking violations for vehicles parked in disabled parking spots. This application mimics integration with the Ukrainian government's "Дія" app.

## Features

- 📸 **Photo Capture**: Take photos directly from mobile camera or upload from desktop
- 🗺️ **GPS Tracking**: Automatic geolocation capture with each photo
- ⏱️ **5-Minute Timer**: Ensures violation duration compliance
- 🤖 **AI Validation** (Mocked): License plate recognition and validation
- 📝 **Submission System**: Complete violation reporting with user details
- 📊 **Status Tracking**: Monitor the case status through various stages
- 🎨 **Modern UI**: Beautiful, responsive design following UX best practices

## Architecture

### Components

The application is organized into 9 slides:

1. **Slide 1 - Intro**: Information about parking violations and fines
2. **Slide 2 - Photo Capture**: Camera interface for first photo
3. **Slide 3 - Validation**: AI validation of license plate and ownership
4. **Slide 4 - Timer**: 5-minute countdown before second photo
5. **Slide 5 - Second Photo**: Capture second photo to prove duration
6. **Slide 6 - Review**: Review both photos and GPS validation
7. **Slide 7 - Submission**: Submit complete violation report
8. **Slide 8 - Integration**: Information about Дія app integration
9. **Slide 9 - Status**: Track the case status and updates

### Services

- **CameraService**: Handles photo capture from camera or file upload
- **GeolocationService**: GPS positioning with fallback to mock data
- **ViolationApiService**: API communication (currently mocked)
- **ViolationStateService**: State management for the violation session
- **TimerService**: 5-minute countdown timer functionality

### Models

- **ViolationSession**: Session data structure
- **PhotoData**: Photo with metadata (GPS, timestamp)
- **SubmissionData**: Complete violation report data
- **AIValidationResponse**: AI validation results
- **CaseStatus**: Case tracking and status updates

## Technology Stack

- **Angular 19**: Latest version with standalone components
- **TypeScript 5.7**: Type-safe development
- **SCSS**: Advanced styling with variables and nesting
- **RxJS**: Reactive programming for async operations
- **FontAwesome**: Icon library

## Installation

```bash
# Navigate to app directory
cd app

# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:4200`

## Development

### Project Structure

```
app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── slide1-intro/
│   │   │   ├── slide2-photo-capture/
│   │   │   ├── slide3-validation/
│   │   │   ├── slide4-timer/
│   │   │   ├── slide5-second-photo/
│   │   │   ├── slide6-review/
│   │   │   ├── slide7-submission/
│   │   │   ├── slide8-integration/
│   │   │   ├── slide9-status/
│   │   │   └── slider-container/
│   │   ├── models/
│   │   │   └── violation.model.ts
│   │   ├── services/
│   │   │   ├── camera.service.ts
│   │   │   ├── geolocation.service.ts
│   │   │   ├── timer.service.ts
│   │   │   ├── violation-api.service.ts
│   │   │   └── violation-state.service.ts
│   │   └── app.component.ts
│   ├── scss/
│   │   └── _resets.scss
│   └── styles.scss
├── angular.json
├── package.json
└── tsconfig.json
```

### Build

```bash
# Development build
npm run build

# Production build
npm run build -- --configuration production

# Watch mode
npm run watch
```

### Testing

```bash
# Run tests
npm test
```

## Features Details

### Photo Capture

- **Mobile**: Uses device camera with `capture="environment"` for back camera
- **Desktop**: File upload dialog for selecting images
- **Fallback**: Graceful degradation if camera not available

### GPS Tracking

- Attempts to use browser's Geolocation API
- Falls back to mock coordinates if unavailable
- Captures coordinates with each photo for validation

### Timer Logic

- 5-minute (300 seconds) countdown
- Visual progress bar
- Can continue in background (note in UI)
- Emits event when complete

### API Integration (Mocked)

Currently uses mock responses with realistic delays:

- **First Photo Submit**: Returns session ID and license plate
- **Second Photo Submit**: Updates session with second photo
- **Violation Submit**: Returns case status with tracking information

### State Management

Uses RxJS BehaviorSubjects for reactive state:

- Session data shared across components
- Case status updates
- Automatic UI updates on state changes

## Design Principles

1. **Mobile-First**: Optimized for mobile devices
2. **Progressive Enhancement**: Works on all devices
3. **Accessibility**: ARIA labels, keyboard navigation, reduced motion support
4. **Performance**: Lazy loading, optimized bundle size
5. **UX**: Clear navigation, visual feedback, loading states

## Future Enhancements

- [ ] Real backend API integration
- [ ] Actual OCR/AI for license plate recognition
- [ ] Push notifications for status updates
- [ ] Photo compression before upload
- [ ] Offline support with service workers
- [ ] Multiple language support
- [ ] User authentication
- [ ] Photo editing capabilities
- [ ] Case history

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project was created for educational/hackathon purposes.

## Contributors

Built with ❤️ for the hackathon
