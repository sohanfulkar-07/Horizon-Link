package com.horizonlink.model

data class DiscoveredDevice(
    val hostName: String,
    val ipAddress: String,
    val version: String,
    val tcpPort: Int,
    val lastSeen: Long = System.currentTimeMillis()
)
