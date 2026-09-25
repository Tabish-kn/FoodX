import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class TasksScreen extends StatelessWidget {
  const TasksScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Volunteer Task Board'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildTaskCard(
            context,
            '80kg Fresh Farm Apples & Bakery Loaves',
            'FreshMart Superstore ➔ Anna Foundation',
            '6.8 km total',
            '+200 Points',
            false,
          ),
          const SizedBox(height: 12),
          _buildTaskCard(
            context,
            '65 Portions Paneer Butter Masala',
            'Spice Garden Banquet ➔ Hope Shelter',
            '2.1 km total',
            '+250 Points (Urgent)',
            true,
          ),
        ],
      ),
    );
  }

  Widget _buildTaskCard(BuildContext context, String title, String route, String distance, String points, bool isUrgent) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: isUrgent ? Colors.red[50] : Colors.amber[50],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: isUrgent ? Colors.red : Colors.amber),
                  ),
                  child: Text(points, style: TextStyle(color: isUrgent ? Colors.red : Colors.amber[900], fontSize: 11, fontWeight: FontWeight.bold)),
                ),
                Text(distance, style: const TextStyle(fontSize: 11, color: Colors.grey)),
              ],
            ),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 4),
            Text(route, style: const TextStyle(fontSize: 12, color: Colors.grey)),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      _showHandshakeModal(context);
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: AppTheme.slateDark),
                    child: const Text('Accept & Verify Handshake'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showHandshakeModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.qr_code_scanner, size: 48, color: AppTheme.primaryEmerald),
            const SizedBox(height: 12),
            const Text('Scan Handshake QR / Enter OTP', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            const Text('Scan donor QR code or enter their 6-digit verification code.', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey, fontSize: 12)),
            const SizedBox(height: 16),
            const TextField(
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              style: TextStyle(letterSpacing: 8, fontWeight: FontWeight.bold, fontSize: 20),
              decoration: InputDecoration(hintText: '482910', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('✅ Pickup Verified! Task is now In-Transit.')),
                );
              },
              style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(48)),
              child: const Text('Verify & Start Trip'),
            ),
          ],
        ),
      ),
    );
  }
}
