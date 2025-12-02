# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **Profile Picture Support**: Users can now upload profile pictures (max 2MB).
- **Settings Redesign**: New "Hero Card" layout for settings page with gradient header.
- **Approval Inbox**: Added profile picture display for pending users.
- **Animations**: Added entrance animations to all major components using `anime.js` v4.
- **UI Effects**: Added `Waves` background effect to Login page.

### Changed

- **Anime.js**: Upgraded to v4 and fixed `animate()` signature usage.
- **Tailwind CSS**: Upgraded to v4.
- **Dependencies**: Added `gsap`, `three`, `ogl` for `reactbits` support.

### Fixed

- **Runtime Error**: Resolved `TypeError: Cannot read properties of undefined (reading 'keyframes')` in `anime.js`.
- **Build Errors**: Fixed missing peer dependencies for `@appletosolutions/reactbits`.
