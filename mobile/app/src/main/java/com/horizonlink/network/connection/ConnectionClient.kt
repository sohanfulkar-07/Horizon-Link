package com.horizonlink.network.connection

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.PrintWriter
import java.net.Socket

class ConnectionClient {
    private var socket: Socket? = null
    private var out: PrintWriter? = null
    private var input: BufferedReader? = null

    suspend fun connect(ip: String, port: Int): Boolean {
        return withContext(Dispatchers.IO) {
            try {
                socket = Socket(ip, port)
                out = PrintWriter(socket!!.getOutputStream(), true)
                input = BufferedReader(InputStreamReader(socket!!.getInputStream()))

                // Perform handshake
                out?.println("CONNECTED")
                val response = input?.readLine()
                
                if (response == "READY") {
                    true
                } else {
                    disconnect()
                    false
                }
            } catch (e: Exception) {
                e.printStackTrace()
                disconnect()
                false
            }
        }
    }

    fun disconnect() {
        try {
            out?.close()
            input?.close()
            socket?.close()
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            out = null
            input = null
            socket = null
        }
    }
}
