export type RiskLevel = 'Low' | 'Medium' | 'High';

export type ScanRecord = {
  value: string;
  category: string;
  length: number;
  risk: RiskLevel;
  suggestion: string;
  date: string;
};

export type DemoUser = {
  name: string;
  email: string;
  password?: string;
};

const HISTORY_KEY = 'scanHistory';
const USERS_KEY = 'smartQRUsers';
const CURRENT_USER_KEY = 'smartQRCurrentUser';
const THEME_KEY = 'smartQRTheme';

export function analyzeQRData(rawValue: string): ScanRecord {
  const value = String(rawValue || '').trim();
  let category = 'Plain Text';
  let risk: RiskLevel = 'Low';
  let suggestion = 'The data appears to be simple text.';

  if (/^https?:\/\//i.test(value)) {
    category = 'Website URL';
    suggestion = 'Open only when the website source is trusted.';

    if (!/^https:\/\//i.test(value) || value.length > 90 || /login|verify|password|bank|free|gift|offer|claim/i.test(value)) {
      risk = 'Medium';
      suggestion = 'This URL may require careful checking before opening.';
    }
  } else if (/^mailto:/i.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    category = 'Email Address';
    suggestion = 'Verify the sender or receiver before sharing sensitive information.';
  } else if (/^tel:/i.test(value) || /^\+?\d{8,15}$/.test(value)) {
    category = 'Phone Number';
    suggestion = 'This QR code contains phone/contact information.';
  } else if (/BEGIN:VCARD/i.test(value) || /MECARD:/i.test(value)) {
    category = 'Contact Card';
    suggestion = 'Review contact details before saving them.';
  } else if (/WIFI:/i.test(value)) {
    category = 'WiFi Network';
    risk = 'Medium';
    suggestion = 'Connect only to networks that belong to trusted sources.';
  } else if (/^[0-9]{8,14}$/.test(value)) {
    category = 'Product Code';
    suggestion = 'This looks like a barcode, EAN, UPC, or product identifier.';
  } else if (/upi:|bitcoin:|ethereum:|wallet|payment|iban/i.test(value)) {
    category = 'Payment or Wallet Data';
    risk = 'High';
    suggestion = 'Check payment details carefully before proceeding.';
  } else if (value.length > 120) {
    category = 'Long Text/Data';
    suggestion = 'Large QR data should be reviewed before use.';
  }

  return {
    value,
    category,
    length: value.length,
    risk,
    suggestion,
    date: new Date().toLocaleString()
  };
}

export function loadHistory(): ScanRecord[] {
  try {
    const data = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as ScanRecord[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveHistory(records: ScanRecord[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records.slice(0, 50)));
}

export function addRecord(value: string): ScanRecord[] {
  const record = analyzeQRData(value);
  if (!record.value) {
    return loadHistory();
  }
  const updated = [record, ...loadHistory()].slice(0, 50);
  saveHistory(updated);
  return updated;
}

export function updateRecord(index: number, value: string): ScanRecord[] {
  const records = loadHistory();
  if (index >= 0 && index < records.length && value.trim()) {
    records[index] = analyzeQRData(value);
    saveHistory(records);
  }
  return records;
}

export function deleteRecord(index: number): ScanRecord[] {
  const records = loadHistory();
  if (index >= 0 && index < records.length) {
    records.splice(index, 1);
    saveHistory(records);
  }
  return records;
}

export function clearAllRecords(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function categoryCounts(records: ScanRecord[]): Record<string, number> {
  return records.reduce<Record<string, number>>((counts, item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
    return counts;
  }, {});
}

export function mediumHighRiskCount(records: ScanRecord[]): number {
  return records.filter((item) => item.risk === 'Medium' || item.risk === 'High').length;
}

export function loadUsers(): DemoUser[] {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as DemoUser[];
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

export function saveUsers(users: DemoUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function setCurrentUser(user: DemoUser): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name: user.name, email: user.email }));
}

export function getCurrentUser(): DemoUser | null {
  try {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null') as DemoUser | null;
    return user && user.name && user.email ? user : null;
  } catch {
    return null;
  }
}

export function applySavedTheme(): void {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark' || savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
}

export function toggleThemeMode(): void {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
}
