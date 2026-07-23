package com.horizonlink.network.discovery

import com.horizonlink.model.DiscoveredDevice
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.flowOn
import org.json.JSONObject
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetAddress

class DiscoveryService {
    private var socket: DatagramSocket? = null

    fun startListening(): Flow<DiscoveredDevice> = callbackFlow {
        val listeningSocket = try {
            DatagramSocket(47777, InetAddress.getByName("0.0.0.0")).apply {
                broadcast = true
            }
        } catch (e: Exception) {
            e.printStackTrace()
            close()
            return@callbackFlow
        }
        
        socket = listeningSocket
        val buffer = ByteArray(1024)

        try {
            while (!listeningSocket.isClosed) {
                val packet = DatagramPacket(buffer, buffer.size)
                listeningSocket.receive(packet)
                
                val message = String(packet.data, 0, packet.length)
                try {
                    val json = JSONObject(message)
                    val device = DiscoveredDevice(
                        hostName = json.getString("hostName"),
                        ipAddress = json.getString("ipAddress"),
                        version = json.getString("version"),
                        tcpPort = json.getInt("tcpPort")
                    )
                    trySend(device)
                } catch (e: Exception) {
                    // Ignore malformed packets
                    e.printStackTrace()
                }
            }
        } catch (e: Exception) {
            if (!listeningSocket.isClosed) {
                e.printStackTrace()
            }
        }

        awaitClose {
            listeningSocket.close()
            socket = null
        }
    }.flowOn(Dispatchers.IO)

    fun stopListening() {
        socket?.close()
        socket = null
    }
}
