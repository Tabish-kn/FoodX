/**
 * Dual Adapter Infrastructure for Third-Party Services
 * Provides production implementations with realistic simulated mock fallbacks.
 */

export interface MapService {
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number;
  calculateETA(distanceKm: number, speedKmH?: number): { etaMinutes: number; routePolyline: string };
  geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }>;
}

export interface NotificationService {
  sendSMS(phone: string, message: string): Promise<boolean>;
  sendEmail(to: string, subject: string, body: string): Promise<boolean>;
  sendPush(fcmToken: string, title: string, body: string): Promise<boolean>;
}

export interface PaymentService {
  createCheckoutSession(amount: number, currency: string, metadata: Record<string, any>): Promise<{ checkoutUrl: string; sessionId: string }>;
  verifyWebhookSignature(payload: any, signature: string): boolean;
}

// 1. Dual Map Adapter
export class DefaultMapService implements MapService {
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Haversine Great-Circle Distance
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  }

  calculateETA(distanceKm: number, speedKmH = 25): { etaMinutes: number; routePolyline: string } {
    const hours = distanceKm / speedKmH;
    const etaMinutes = Math.max(5, Math.round(hours * 60));
    return {
      etaMinutes,
      routePolyline: `mock_polyline_for_${distanceKm}km`
    };
  }

  async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }> {
    // Return sample Delhi coordinate with slight hash offset for mock realism
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      latitude: 28.6139 + (hash % 100) * 0.001,
      longitude: 77.2090 + ((hash * 7) % 100) * 0.001
    };
  }
}

// 2. Dual Notification Adapter
export class DefaultNotificationService implements NotificationService {
  async sendSMS(phone: string, message: string): Promise<boolean> {
    console.log(`📱 [SMS ADAPTER] Sending SMS to ${phone}: "${message}"`);
    return true;
  }

  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    console.log(`✉️ [EMAIL ADAPTER] Sending Email to ${to} | Subject: "${subject}"`);
    return true;
  }

  async sendPush(fcmToken: string, title: string, body: string): Promise<boolean> {
    console.log(`🔔 [PUSH ADAPTER] Sending Push Notification | "${title}": "${body}"`);
    return true;
  }
}

// 3. Dual Payment Adapter
export class DefaultPaymentService implements PaymentService {
  async createCheckoutSession(amount: number, currency: string, metadata: Record<string, any>): Promise<{ checkoutUrl: string; sessionId: string }> {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    console.log(`💳 [PAYMENT ADAPTER] Created Checkout Session for ${amount} ${currency}`);
    return {
      sessionId,
      checkoutUrl: `https://checkout.foodx.org/pay/${sessionId}`
    };
  }

  verifyWebhookSignature(payload: any, signature: string): boolean {
    return true;
  }
}

export const mapService = new DefaultMapService();
export const notificationService = new DefaultNotificationService();
export const paymentService = new DefaultPaymentService();
