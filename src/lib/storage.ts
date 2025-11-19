// LocalStorage utilities for Manikandan Arts

export interface Student {
  id: number;
  name: string;
  grade: string;
  phone: string;
  username: string;
  pass: string;
  activated: boolean;
  activationDate: string | null;
  lastPaymentDate: string | null;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  grade: string;
}

export interface Assignment {
  id: string;
  studentUsername: string;
  studentName: string;
  grade: string;
  imageData: string;
  uploadDate: string;
  grade_score?: number;
  feedback?: string;
}

export interface AdminCreds {
  username: string;
  password: string;
}

const DEFAULT_BILLING_DAYS = 30;
const DEFAULT_ADMIN: AdminCreds = { username: 'admin', password: 'live123' };

// Initialize defaults
export function initDefaults() {
  if (!localStorage.getItem('adminCreds')) {
    localStorage.setItem('adminCreds', JSON.stringify(DEFAULT_ADMIN));
  }
  if (!localStorage.getItem('billingDays')) {
    localStorage.setItem('billingDays', String(DEFAULT_BILLING_DAYS));
  }
  if (!localStorage.getItem('classVideos')) {
    localStorage.setItem('classVideos', JSON.stringify({}));
  }
  if (!localStorage.getItem('assignments')) {
    localStorage.setItem('assignments', JSON.stringify([]));
  }
  if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify([]));
  }
}

// Student operations
export function getStudents(): Student[] {
  return JSON.parse(localStorage.getItem('students') || '[]');
}

export function saveStudents(students: Student[]) {
  localStorage.setItem('students', JSON.stringify(students));
}

export function findStudentByUsername(username: string): Student | null {
  return getStudents().find(s => s.username === username) || null;
}

export function addStudent(student: Omit<Student, 'id'>): Student {
  const students = getStudents();
  const newStudent = { ...student, id: Date.now() };
  students.push(newStudent);
  saveStudents(students);
  return newStudent;
}

export function updateStudent(id: number, updates: Partial<Student>) {
  const students = getStudents();
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...updates };
    saveStudents(students);
    return students[index];
  }
  return null;
}

export function deleteStudent(id: number) {
  const students = getStudents().filter(s => s.id !== id);
  saveStudents(students);
}

// Video operations
export function getVideosForGrade(grade: string): string[] {
  const all = JSON.parse(localStorage.getItem('classVideos') || '{}');
  return all[grade] || [];
}

export function addVideoForGrade(grade: string, url: string) {
  const all = JSON.parse(localStorage.getItem('classVideos') || '{}');
  if (!all[grade]) all[grade] = [];
  all[grade].push(url);
  localStorage.setItem('classVideos', JSON.stringify(all));
}

// Assignment operations
export function getAssignments(): Assignment[] {
  return JSON.parse(localStorage.getItem('assignments') || '[]');
}

export function getAssignmentsByStudent(username: string): Assignment[] {
  return getAssignments().filter(a => a.studentUsername === username);
}

export function getAssignmentsByGrade(grade: string): Assignment[] {
  return getAssignments().filter(a => a.grade === grade);
}

export function addAssignment(assignment: Omit<Assignment, 'id' | 'uploadDate'>): Assignment {
  const assignments = getAssignments();
  const newAssignment: Assignment = {
    ...assignment,
    id: `assign_${Date.now()}`,
    uploadDate: new Date().toISOString()
  };
  assignments.push(newAssignment);
  localStorage.setItem('assignments', JSON.stringify(assignments));
  return newAssignment;
}

export function updateAssignment(id: string, updates: Partial<Assignment>) {
  const assignments = getAssignments();
  const index = assignments.findIndex(a => a.id === id);
  if (index !== -1) {
    assignments[index] = { ...assignments[index], ...updates };
    localStorage.setItem('assignments', JSON.stringify(assignments));
    return assignments[index];
  }
  return null;
}

// Billing operations
export function getBillingDays(): number {
  return parseInt(localStorage.getItem('billingDays') || String(DEFAULT_BILLING_DAYS), 10);
}

export function setBillingDays(days: number) {
  localStorage.setItem('billingDays', String(days));
}

export function calcExpiryInfo(activationISO: string | null) {
  const billingDays = getBillingDays();
  if (!activationISO) return { remaining: -1, expiresAt: null };
  
  const act = new Date(activationISO);
  const expire = new Date(act.getTime() + billingDays * 24 * 60 * 60 * 1000);
  const now = new Date();
  const diff = Math.ceil((expire.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return { remaining: diff, expiresAt: expire };
}

// Admin operations
export function getAdminCreds(): AdminCreds {
  return JSON.parse(localStorage.getItem('adminCreds') || JSON.stringify(DEFAULT_ADMIN));
}

export function updateAdminCreds(creds: AdminCreds) {
  localStorage.setItem('adminCreds', JSON.stringify(creds));
}

// UPI QR operations
export function getUpiQR(): string {
  return localStorage.getItem('upiQR') || '';
}

export function setUpiQR(data: string) {
  localStorage.setItem('upiQR', data);
}

// Enforce expiry on init
export function enforceExpiry() {
  const billingDays = getBillingDays();
  let students = getStudents();
  let changed = false;
  
  students.forEach(s => {
    if (s.activated && s.activationDate) {
      const act = new Date(s.activationDate);
      const expire = new Date(act.getTime() + billingDays * 24 * 60 * 60 * 1000);
      if (new Date() > expire) {
        s.activated = false;
        changed = true;
      }
    }
  });
  
  if (changed) saveStudents(students);
}
