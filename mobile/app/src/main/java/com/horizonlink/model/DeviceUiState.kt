package com.horizonlink.model

data class DeviceUiState(
    val device: DiscoveredDevice,
    val isConnected: Boolean = false,
    val isConnecting: Boolean = false
)
