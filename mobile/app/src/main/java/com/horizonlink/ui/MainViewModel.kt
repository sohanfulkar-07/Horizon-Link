package com.horizonlink.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.horizonlink.connection.ConnectionClient
import com.horizonlink.discovery.DiscoveredDevice
import com.horizonlink.discovery.DiscoveryService
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class DeviceUiState(
    val device: DiscoveredDevice,
    val isConnected: Boolean = false,
    val isConnecting: Boolean = false
)

class MainViewModel : ViewModel() {
    private val discoveryService = DiscoveryService()
    private val connectionClients = mutableMapOf<String, ConnectionClient>()

    private val _devices = MutableStateFlow<List<DeviceUiState>>(emptyList())
    val devices: StateFlow<List<DeviceUiState>> = _devices.asStateFlow()

    private var cleanupJob: Job? = null

    init {
        startDiscovery()
        startCleanupRoutine()
    }

    private fun startDiscovery() {
        viewModelScope.launch {
            discoveryService.startListening { newDevice ->
                _devices.update { currentList ->
                    val existingIndex = currentList.indexOfFirst { it.device.ipAddress == newDevice.ipAddress }
                    if (existingIndex >= 0) {
                        val updatedList = currentList.toMutableList()
                        updatedList[existingIndex] = updatedList[existingIndex].copy(
                            device = newDevice.copy(lastSeen = System.currentTimeMillis())
                        )
                        updatedList
                    } else {
                        currentList + DeviceUiState(device = newDevice.copy(lastSeen = System.currentTimeMillis()))
                    }
                }
            }
        }
    }

    private fun startCleanupRoutine() {
        cleanupJob = viewModelScope.launch {
            while (true) {
                delay(5000) // Check every 5 seconds
                val now = System.currentTimeMillis()
                _devices.update { currentList ->
                    currentList.filter { 
                        it.isConnected || (now - it.device.lastSeen < 10000) // Keep connected or seen in last 10s
                    }
                }
            }
        }
    }

    fun connectToDevice(ip: String, port: Int) {
        viewModelScope.launch {
            _devices.update { list ->
                list.map { if (it.device.ipAddress == ip) it.copy(isConnecting = true) else it }
            }

            val client = ConnectionClient()
            connectionClients[ip] = client
            val success = client.connect(ip, port)

            _devices.update { list ->
                list.map { 
                    if (it.device.ipAddress == ip) {
                        it.copy(isConnected = success, isConnecting = false)
                    } else it 
                }
            }
        }
    }

    fun disconnectFromDevice(ip: String) {
        connectionClients[ip]?.disconnect()
        connectionClients.remove(ip)
        _devices.update { list ->
            list.map { if (it.device.ipAddress == ip) it.copy(isConnected = false) else it }
        }
    }

    override fun onCleared() {
        super.onCleared()
        discoveryService.stopListening()
        connectionClients.values.forEach { it.disconnect() }
        connectionClients.clear()
    }
}
