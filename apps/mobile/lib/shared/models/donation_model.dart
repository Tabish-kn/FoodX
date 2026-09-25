class DonationModel {
  final String id;
  final String title;
  final String category;
  final double quantity;
  final String unit;
  final int numberOfMeals;
  final String status;
  final String priority;
  final DateTime expiryTime;
  final String pickupAddress;
  final String? qrCode;
  final String? otpCode;

  DonationModel({
    required this.id,
    required this.title,
    required this.category,
    required this.quantity,
    required this.unit,
    required this.numberOfMeals,
    required this.status,
    required this.priority,
    required this.expiryTime,
    required this.pickupAddress,
    this.qrCode,
    this.otpCode,
  });

  factory DonationModel.fromJson(Map<String, dynamic> json) {
    return DonationModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      category: json['category'] ?? 'COOKED_MEALS',
      quantity: (json['quantity'] as num?)?.toDouble() ?? 0.0,
      unit: json['unit'] ?? 'kg',
      numberOfMeals: json['numberOfMeals'] ?? 1,
      status: json['status'] ?? 'PUBLISHED',
      priority: json['priority'] ?? 'NORMAL',
      expiryTime: DateTime.tryParse(json['expiryTime'] ?? '') ?? DateTime.now().add(const Duration(hours: 4)),
      pickupAddress: json['pickupAddress'] is Map ? json['pickupAddress']['street'] ?? 'Delhi Hub' : 'Delhi Hub',
      qrCode: json['qrCode'],
      otpCode: json['otpCode'],
    );
  }
}
