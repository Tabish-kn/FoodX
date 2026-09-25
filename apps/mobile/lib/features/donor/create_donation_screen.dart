import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class CreateDonationScreen extends StatefulWidget {
  const CreateDonationScreen({super.key});

  @override
  State<CreateDonationScreen> createState() => _CreateDonationScreenState();
}

class _CreateDonationScreenState extends State<CreateDonationScreen> {
  final _titleController = TextEditingController(text: '75 Portions Mixed Dal & Jeera Rice');
  final _quantityController = TextEditingController(text: '25');
  final _mealsController = TextEditingController(text: '75');
  String _category = 'Cooked Meals';
  double _hoursToExpiry = 4.0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Post Food Surplus'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Food Item Details', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'Food Title',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _category,
              items: ['Cooked Meals', 'Hotel Surplus', 'Fruits', 'Bakery', 'Dairy']
                  .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                  .toList(),
              onChanged: (val) => setState(() => _category = val!),
              decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _quantityController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Quantity (kg)', border: OutlineInputBorder()),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: _mealsController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Meals Count', border: OutlineInputBorder()),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Text('Best Before Expiry (${_hoursToExpiry.toInt()} hours remaining)', style: const TextStyle(fontWeight: FontWeight.bold)),
            Slider(
              value: _hoursToExpiry,
              min: 1,
              max: 24,
              divisions: 23,
              activeColor: AppTheme.primaryEmerald,
              onChanged: (val) => setState(() => _hoursToExpiry = val),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('🎉 Donation Published & Matching with Nearby Shelters!')),
                );
                Navigator.of(context).pop();
              },
              style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(50)),
              child: const Text('Publish & Generate Handshake QR'),
            ),
          ],
        ),
      ),
    );
  }
}
