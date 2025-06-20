import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names with Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format time duration for child-friendly display
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  }
  
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

/**
 * Get child-friendly greeting based on time of day
 */
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

/**
 * Generate encouraging messages for different scenarios
 */
export function getEncouragingMessage(type: 'correct' | 'incorrect' | 'complete' | 'start'): string {
  const messages = {
    correct: [
      'Excellent work! 🌟',
      'Amazing job! ⭐',
      'You got it! 🎉',
      'Perfect! 👏',
      'Outstanding! ✨',
    ],
    incorrect: [
      'Good try! Let\'s learn together! 💪',
      'Almost there! You\'re getting stronger! 🌱',
      'Nice effort! Let\'s try again! 🚀',
      'You\'re learning! That\'s what matters! 📚',
      'Keep going! You\'ve got this! 💫',
    ],
    complete: [
      'Amazing work today! 🎊',
      'You did fantastic! 🌈',
      'Great learning session! 📈',
      'You\'re getting smarter every day! 🧠',
      'Proud of your hard work! 🏆',
    ],
    start: [
      'Ready for today\'s adventure? 🚀',
      'Let\'s have some fun learning! 🎮',
      'Time to show what you know! ⭐',
      'Ready to be awesome? 💫',
      'Let\'s make today amazing! 🌟',
    ],
  };
  
  const messageList = messages[type];
  return messageList[Math.floor(Math.random() * messageList.length)];
}

/**
 * Calculate score percentage and return with appropriate emoji
 */
export function getScoreDisplay(correct: number, total: number): { percentage: number; stars: string; message: string } {
  const percentage = Math.round((correct / total) * 100);
  
  let stars = '';
  let message = '';
  
  if (percentage >= 95) {
    stars = '⭐⭐⭐⭐⭐';
    message = 'Perfect! You\'re unstoppable!';
  } else if (percentage >= 85) {
    stars = '⭐⭐⭐⭐';
    message = 'Excellent work!';
  } else if (percentage >= 75) {
    stars = '⭐⭐⭐';
    message = 'Great job!';
  } else if (percentage >= 65) {
    stars = '⭐⭐';
    message = 'Nice work!';
  } else {
    stars = '⭐';
    message = 'Good effort! You\'re getting stronger!';
  }
  
  return { percentage, stars, message };
}

/**
 * Validate file types for CSV upload
 */
export function isValidCSVFile(file: File): boolean {
  const validTypes = ['text/csv', 'application/csv', 'text/plain'];
  const validExtensions = ['.csv'];
  
  return validTypes.includes(file.type) || 
         validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Debounce function for search and input handling
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}