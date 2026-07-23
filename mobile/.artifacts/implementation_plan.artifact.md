# Implementation Plan - Fix All Issues

The project currently fails to build due to a Gradle compatibility issue (`HasConvention` error), likely caused by AGP 8.2.0 being incompatible with Gradle 9.0+. Additionally, there are several robustness issues in the networking code, potential resource leaks, and missing lifecycle optimizations.

## User Review Required

> [!IMPORTANT]
> **Gradle & Plugin Upgrades:** I will upgrade the Android Gradle Plugin (AGP) and Kotlin versions to ensure compatibility with modern Gradle environments. This is necessary to fix the build failure.
> **Compose Compiler:** Upgrading Kotlin requires a matching upgrade to the Compose Compiler extension version.

## Proposed Changes

### Build Configuration

#### [MODIFY] [root build.gradle.kts](file:///C:/Users/Sohan/OneDrive/Documents/Desktop/Horizon-Link/mobile/build.gradle.kts)
- Upgrade AGP from `8.2.0` to `8.5.1`.
- Upgrade Kotlin from `1.9.20` to `1.9.24`.

#### [MODIFY] [app build.gradle.kts](file:///C:/Users/Sohan/OneDrive/Documents/Desktop/Horizon-Link/mobile/app/build.gradle.kts)
- Upgrade `kotlinCompilerExtensionVersion` from `1.5.4` to `1.5.14` to match Kotlin `1.9.24`.

### Network & Reliability

#### [MODIFY] [ConnectionClient.kt](file:///C:/Users/Sohan/OneDrive/Documents/Desktop/Horizon-Link/mobile/app/src/main/java/com/horizonlink/network/connection/ConnectionClient.kt)
- Add a socket timeout (e.g., 5 seconds) to prevent indefinite blocking during connection or handshake.
- Ensure all resources are properly closed in `disconnect`.

#### [MODIFY] [DiscoveryService.kt](file:///C:/Users/Sohan/OneDrive/Documents/Desktop/Horizon-Link/mobile/app/src/main/java/com/horizonlink/network/discovery/DiscoveryService.kt)
- Refactor `startListening` to use `callbackFlow` for better integration with Kotlin Coroutines and better lifecycle management.
- Improve error handling in the UDP listening loop to prevent it from crashing the entire service on a single malformed packet.

#### [MODIFY] [MainViewModel.kt](file:///C:/Users/Sohan/OneDrive/Documents/Desktop/Horizon-Link/mobile/app/src/main/java/com/horizonlink/viewmodel/MainViewModel.kt)
- Update to consume the new `DiscoveryService` flow.
- Fix a potential socket leak: ensure any existing connection to an IP is closed before starting a new one.
- Improve state updates to ensure `isConnecting` is always reset, even on unexpected exceptions.

## Verification Plan

### Automated Tests
- Run `gradle_build assembleDebug` to verify the build issue is resolved.

### Manual Verification
- Review the logic in `MainViewModel` to ensure that device discovery and cleanup work correctly with the new Flow-based service.
- Verify that `disconnect` is called properly when the ViewModel is cleared.
