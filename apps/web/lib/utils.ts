import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatHoursRemaining(expiryString: string): { text: string; isUrgent: boolean; isEmergency: boolean } {
  const expiry = new Date(expiryString).getTime();
  const now = Date.now();
  const diffMs = expiry - now;

  if (diffMs <= 0) return { text: 'Expired', isUrgent: true, isEmergency: true };

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours < 1) {
    return { text: `${minutes}m left`, isUrgent: true, isEmergency: true };
  } else if (hours < 3) {
    return { text: `${hours}h ${minutes}m left`, isUrgent: true, isEmergency: false };
  }
  return { text: `${hours}h left`, isUrgent: false, isEmergency: false };
}
