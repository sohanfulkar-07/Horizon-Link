package com.horizonlink.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.horizonlink.ui.theme.HorizonLinkTheme
import com.horizonlink.ui.theme.SuccessGreen
import com.horizonlink.ui.theme.TextSecondary

class MainActivity : ComponentActivity() {
    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            HorizonLinkTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val devices by viewModel.devices.collectAsState()
                    DeviceListScreen(
                        devices = devices,
                        onConnect = { ip, port -> viewModel.connectToDevice(ip, port) },
                        onDisconnect = { ip -> viewModel.disconnectFromDevice(ip) }
                    )
                }
            }
        }
    }
}

@Composable
fun DeviceListScreen(
    devices: List<DeviceUiState>,
    onConnect: (String, Int) -> Unit,
    onDisconnect: (String) -> Unit
) {
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text(
            text = "Horizon Link",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        Text(
            text = "Discovered Devices",
            style = MaterialTheme.typography.titleMedium,
            color = TextSecondary,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        if (devices.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(text = "Searching for devices...", color = TextSecondary)
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(devices) { deviceState ->
                    DeviceCard(
                        state = deviceState,
                        onConnectClick = { onConnect(deviceState.device.ipAddress, deviceState.device.tcpPort) },
                        onDisconnectClick = { onDisconnect(deviceState.device.ipAddress) }
                    )
                }
            }
        }
    }
}

@Composable
fun DeviceCard(
    state: DeviceUiState,
    onConnectClick: () -> Unit,
    onDisconnectClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(
                    text = state.device.hostName,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = state.device.ipAddress,
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 4.dp)) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .background(
                                color = if (state.isConnected) SuccessGreen else TextSecondary,
                                shape = RoundedCornerShape(50)
                            )
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = if (state.isConnected) "Connected" else "Available",
                        style = MaterialTheme.typography.bodySmall,
                        color = if (state.isConnected) SuccessGreen else TextSecondary
                    )
                }
            }

            if (state.isConnected) {
                Button(
                    onClick = onDisconnectClick,
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Text("Disconnect")
                }
            } else {
                Button(
                    onClick = onConnectClick,
                    enabled = !state.isConnecting
                ) {
                    Text(if (state.isConnecting) "Connecting..." else "Connect")
                }
            }
        }
    }
}
