import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../donor/create_donation_screen.dart';
import '../volunteer/tasks_screen.dart';
import '../leaderboard/leaderboard_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    const DashboardHomeView(),
    const TasksScreen(),
    const LeaderboardScreen(),
    const ProfileView(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (idx) => setState(() => _selectedIndex = idx),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home, color: AppTheme.primaryEmerald),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.delivery_dining_outlined),
            selectedIcon: Icon(Icons.delivery_dining, color: AppTheme.primaryEmerald),
            label: 'Tasks',
          ),
          NavigationDestination(
            icon: Icon(Icons.emoji_events_outlined),
            selectedIcon: Icon(Icons.emoji_events, color: AppTheme.secondaryAmber),
            label: 'Heroes',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person, color: AppTheme.primaryEmerald),
            label: 'Profile',
          ),
        ],
      ),
      floatingActionButton: _selectedIndex == 0
          ? FloatingActionButton.extended(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (context) => const CreateDonationScreen()),
                );
              },
              backgroundColor: AppTheme.primaryEmerald,
              icon: const Icon(Icons.add, color: Colors.white),
              label: const Text('Donate Food', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            )
          : null,
    );
  }
}

class DashboardHomeView extends StatelessWidget {
  const DashboardHomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Welcome to FoodX',
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(color: Colors.grey[600]),
                    ),
                    Text(
                      'Grand Palace Hotel (Donor)',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryEmerald.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.primaryEmerald.withOpacity(0.3)),
                  ),
                  child: const Text('LIVE RESCUE', style: TextStyle(color: AppTheme.primaryEmerald, fontSize: 10, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Emergency Alert Banner
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFFE11D48), Color(0xFFF59E0B)]),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: const [
                  Icon(Icons.warning_amber_rounded, color: Colors.white),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      '🚨 120 hot meals needed for Night Shelter, Lajpat Nagar IV',
                      style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Impact Matrix
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(context, '14,820+', 'Meals Rescued', Icons.restaurant, AppTheme.primaryEmerald),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMetricCard(context, '37.1 tons', 'CO₂ Prevented', Icons.eco, Colors.teal),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Active In-Transit Card
            Text(
              'Active Rescue In-Transit',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('150 Portions Veg Biryani', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(color: Colors.amber[100], borderRadius: BorderRadius.circular(12)),
                          child: const Text('ETA 14m', style: TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 10)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text('Grand Palace Hotel ➔ Anna Foundation NGO', style: TextStyle(color: Colors.grey, fontSize: 12)),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      onPressed: () {
                        context.push('/tracking');
                      },
                      icon: const Icon(Icons.location_on, size: 16),
                      label: const Text('Open Real-Time GPS Map'),
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size.fromHeight(40),
                        backgroundColor: AppTheme.slateDark,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard(BuildContext context, String value, String label, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
            Text(label, style: const TextStyle(fontSize: 11, color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

class ProfileView extends StatelessWidget {
  const ProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const CircleAvatar(radius: 40, backgroundColor: AppTheme.primaryEmerald, child: Icon(Icons.business, color: Colors.white, size: 40)),
            const SizedBox(height: 12),
            const Text('Grand Palace Hotel & Banquets', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const Text('FSSAI: 110022998811 • Verified Donor', style: TextStyle(color: Colors.grey, fontSize: 12)),
            const SizedBox(height: 24),
            const ListTile(
              leading: Icon(Icons.emoji_events, color: AppTheme.secondaryAmber),
              title: Text('Reward Points'),
              trailing: Text('6,500 pts', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
            ListTile(
              leading: const Icon(Icons.file_download, color: AppTheme.primaryEmerald),
              title: const Text('CSR Landfill Tax Certificate'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Downloading Certificate...')));
              },
            ),
          ],
        ),
      ),
    );
  }
}
