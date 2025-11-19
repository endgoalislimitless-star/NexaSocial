# Nexa Design Guidelines

## Architecture Decisions

### Authentication
**Required** - Full authentication implementation needed:
- Apple Sign-In for iOS (required)
- Google Sign-In for cross-platform
- Email/password option
- Multi-factor authentication support (biometric, TOTP)
- Session management with automatic timeout
- Privacy policy & terms of service links

Account management:
- Profile/settings screen with customizable avatar
- Display name and bio fields
- Privacy settings dashboard
- Log out with confirmation
- Delete account (nested under Settings > Account > Delete, with double confirmation)

### Navigation
**Tab Navigation** (5 tabs):
- Home (main feed)
- Search (discovery)
- Create (floating action button - center position)
- Notifications (activity)
- Profile (user profile)

Additional navigation patterns:
- Gesture support: swipe down for search, swipe up for create
- Context-aware floating action buttons
- Seamless modal transitions for post creation

## Screen Specifications

### Home Feed
- **Purpose**: Display chronological feed of posts from all users
- **Header**: Transparent with Nexa logo, search button (right)
- **Layout**: 
  - Scrollable list of post cards
  - Infinite scroll with "pause" indicators when scrolling too fast
  - Safe area insets: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl
- **Components**: Post cards with image, caption, like/comment buttons, user avatar/name

### Create Post Screen
- **Purpose**: Create new posts with photo and text
- **Header**: Custom header with "Cancel" (left) and "Post" (right) buttons
- **Layout**:
  - Form-based with image picker
  - Caption text input with character counter
  - Submit/cancel buttons in header
  - Safe area insets: top = headerHeight + Spacing.xl, bottom = insets.bottom + Spacing.xl

### Profile Screen
- **Purpose**: Display user profile and their posts
- **Header**: Transparent with settings icon (right)
- **Layout**:
  - Dynamic profile header (avatar, name, bio, stats)
  - Content organization tabs: All Posts, Photos, Text
  - Grid/list view of user's posts
  - Safe area insets: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

### Search/Discovery Screen
- **Purpose**: Find and discover other users
- **Header**: Search bar (prominent)
- **Layout**: 
  - Scrollable list of user results
  - Safe area insets: top = Spacing.xl, bottom = tabBarHeight + Spacing.xl

### Notifications Screen
- **Purpose**: View activity and interactions
- **Header**: Default with title "Notifications"
- **Layout**: 
  - Scrollable list of notification items
  - Safe area insets: top = Spacing.xl, bottom = tabBarHeight + Spacing.xl

## Design System

### Visual Identity
**Primary Colors**:
- Nexa Blue: `#4361ee` (trust, intelligence) - primary brand color
- Gradient Accents: `#4cc9f0` to `#4895ef` - for highlights and CTAs
- Background: `#ffffff` (light mode), `#0a0a0a` (dark mode)
- Surface: `#f8f9fa` (light mode), `#1a1a1a` (dark mode)
- Text Primary: `#212529` (light mode), `#f8f9fa` (dark mode)
- Text Secondary: `#6c757d` (both modes)
- Error: `#dc3545`
- Success: `#28a745`

**Typography**:
- Headings: Inter Bold
- Body: Inter Regular
- All text highly readable with proper contrast ratios
- Minimum font size: 14px for body text
- Line height: 1.5 for readability

**Iconography**:
- Use Feather icons from @expo/vector-icons
- Line icons with rounded corners
- Consistent stroke width (1.5px)
- NO emojis in the application

### Component Patterns

**Post Cards**:
- Clean card design with subtle shadows
- User avatar and name at top
- Image displayed full-width within card
- Caption text below image
- Like and comment buttons with counts
- Visual feedback on interaction

**Buttons**:
- Primary: Filled with Nexa Blue, white text
- Secondary: Outlined with Nexa Blue border
- Text buttons for tertiary actions
- All buttons have press feedback

**Floating Action Button** (Create):
- Uses subtle drop shadow:
  - shadowOffset: {width: 0, height: 2}
  - shadowOpacity: 0.10
  - shadowRadius: 2
- Positioned in center of tab bar
- Haptic feedback on press

**Forms**:
- Clear labels for all inputs
- Inline validation with helpful error messages
- Submit/cancel in header
- Disabled state styling for invalid forms

### Interaction Design

**Animations**:
- **Philosophy**: Purposeful, not decorative - all animations serve a functional purpose
- **Physics-based easing**: Spring animations with natural motion (no linear easing)
- **60fps target**: Smooth performance using Reanimated 3
- **Duration**: Based on distance and importance (100-300ms typical)

**Micro-interactions**:
- Haptic feedback for key actions (likes, comments, post creation)
- Visual confirmation states for all critical operations
- Like button animation: scale + color change with haptic
- Comment submission: slide-up animation with feedback
- Pull-to-refresh with custom indicator

**Loading States**:
- Skeleton screens for content previews
- Shimmer effect during loading
- Interactive loading animations that respond to user movement
- Never use generic spinners

**Gestures**:
- Pull-down to refresh feed
- Swipe for contextual actions
- Double-tap to like posts
- Pinch for settings access

### Accessibility

**Requirements**:
- Support Dynamic Type for text scaling
- VoiceOver/TalkBack compatibility for all interactive elements
- Minimum touch target size: 44x44 points
- Color contrast ratios: 4.5:1 minimum for text
- Alternative text for all images
- Screen reader announcements for state changes

### Assets

**Critical Generated Assets**:
1. **User Avatars** (5-8 preset options):
   - Geometric, modern designs in Nexa brand colors
   - Diverse, abstract representations
   - Circular format, 200x200px minimum
   
2. **App Icon**:
   - Nexa logo with gradient background
   - Simple, recognizable at small sizes

3. **Placeholder Images**:
   - Default post image placeholder
   - Empty state illustrations for feed/profile

**NO custom decorative assets** beyond these core elements. Use system icons and Feather icons for all other UI elements.

### Performance & Polish

**Animation Performance**:
- All UI animations at 60fps minimum
- Use native driver where possible
- Optimize images with compression
- Lazy load off-screen content

**Visual Feedback**:
- Every touchable element must have visual response
- State changes clearly communicated
- Error states with helpful messaging
- Success confirmations for important actions

**Dark Mode**:
- Automatic switching based on system settings
- Properly contrasted colors in both modes
- No pure black backgrounds (#0a0a0a instead)