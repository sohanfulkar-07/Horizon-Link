package com.horizonlink.network.discovery

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetAddress
import com.horizonlink.model.DiscoveredDevice

class DiscoveryService {
    private var socket: DatagramSocket? = null
    private var isListening = false

    suspend fun startListening(onDeviceDiscovered: (DiscoveredDevice) -> Unit) {
        withContext(Dispatchers.IO) {
            isListening = true
            try {
                socket = DatagramSocket(47777, InetAddress.getByName("0.0.0.0"))
                socket?.broadcast = true
                val buffer = ByteArray(1024)
                
                while (isListening) {
                    val packet = DatagramPacket(buffer, buffer.size)
                    socket?.receive(packet)
                    
                    val message = String(packet.data, 0, packet.length)
                    try {
                        val json = JSONObject(message)
                        val device = DiscoveredDevice(
                            hostName = json.getString("hostName"),
                            ipAddress = json.getString("ipAddress"),
                            version = json.getString("version"),
                            tcpPort = json.getInt("tcpPort")
                        )
                        onDeviceDiscovered(device)
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                socket?.close()
                socket = null
            }
        }
    }

    fun stopListening() {
        isListening = false
        socket?.close()
        socket = null
    }
}
