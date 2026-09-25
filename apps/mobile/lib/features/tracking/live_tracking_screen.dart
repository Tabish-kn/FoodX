import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class LiveTrackingScreen extends StatelessWidget {
  const LiveTrackingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Courier GPS Tracking'),
      ),
      body: Column(
        children: [
          // Map Canvas Placeholder with live visual cues
          Expanded(
            child: Container(
              color: AppTheme.slateDark,
              child: Stack(
                children: [
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppTheme.secondaryAmber,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(color: AppTheme.secondaryAmber.withOpacity(0.5), blurRadius: 20, spreadRadius: 5),
                            ],
                          ),
                          child: const Icon(Icons.delivery_dining, size: 36, color: Colors.black),
                        ),
                        const SizedBox(height: 12),
                        const Text('Courier Alex (Electric Scooter)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        const Text('Speed: 28 km/h • 4.2 km remaining', style: TextStyle(color: Colors.grey, fontSize: 12)),
                      ],
                    ),
                  ),
                  Positioned(
                    top: 16,
                    left: 16,
                    right: 16,
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.9),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: const [
                          Text('ETA: 14 Minutes', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryEmerald)),
                          Text('150 Meals In-Transit', style: TextStyle(fontSize: 12, color: Colors.grey)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Waypoints & Live Actions
          Container(
            padding: const EdgeInsets.all(20),
            color: Colors.white,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Mission Waypoints', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                const SizedBox(height: 12),
                Row(
                  children: const [
                    Icon(Icons.check_circle, color: AppTheme.primaryEmerald, size: 18),
                    SizedBox(width: 8),
                    Expanded(child: Text('Grand Palace Hotel (Picked Up)', style: TextStyle(fontSize: 12))),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: const [
                    Icon(Icons.radio_button_checked, color: AppTheme.secondaryAmber, size: 18),
                    SizedBox(width: 8),
                    Expanded(child: Text('In-Transit via Outer Ring Road', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold))),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: const [
                    Icon(Icons.location_on, color: Colors.grey, size: 18),
                    SizedBox(width: 8),
                    Expanded(child: Text('Anna Foundation NGO Shelter (Destination)', style: TextStyle(fontSize: 12, color: Colors.grey))),
                  ],
                ),
                const SizedBox(height: 16),
                ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Calling Courier Courier...')));
                  },
                  icon: const Icon(Icons.call, size: 16),
                  label: const Text('Contact Courier Courier'),
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size.fromHeight(44),
                    backgroundColor: AppTheme.primaryEmerald,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
