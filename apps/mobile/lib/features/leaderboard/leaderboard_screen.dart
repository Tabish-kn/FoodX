import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('City Champions'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Top Podium Hero
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [AppTheme.secondaryAmber, Color(0xFFD97706)]),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: const [
                Text('👑 #1 City Champion', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                SizedBox(height: 8),
                Text('FreshMart Superstore Network', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                SizedBox(height: 4),
                Text('12,000 pts • 9,200 meals rescued', style: TextStyle(color: Colors.white70, fontSize: 12)),
              ],
            ),
          ),
          const SizedBox(height: 16),

          _buildRankTile(2, 'Anna Foundation NGO', '8,500 pts', '3,420 meals', '⭐ Community Hero'),
          _buildRankTile(3, 'Grand Palace Hotel & Banquets', '6,500 pts', '4,800 meals', '🏆 Super Donor'),
          _buildRankTile(4, 'Alex Sharma (Rapid Courier)', '3,400 pts', '1,100 meals', '🚴 Golden Courier'),
          _buildRankTile(5, 'Spice Garden Banquet Hall', '2,900 pts', '1,850 meals', '🌱 First Step'),
        ],
      ),
    );
  }

  Widget _buildRankTile(int rank, String name, String points, String meals, String badge) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.grey[100],
          child: Text('#$rank', style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.slateDark)),
        ),
        title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        subtitle: Text('$meals • $badge', style: const TextStyle(fontSize: 11, color: Colors.grey)),
        trailing: Text(points, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryEmerald)),
      ),
    );
  }
}
