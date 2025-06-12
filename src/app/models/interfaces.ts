export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  enrollmentDate: Date;
  studentId: string;
  grade: string;
  classes: string[];
  status: 'active' | 'inactive' | 'graduated';
  schoolId: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  department: string;
  subjects: string[];
  hireDate: Date;
  status: 'active' | 'inactive';
  schoolId: string;
}

export interface Personnel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  position: string;
  department: string;
  hireDate: Date;
  status: 'active' | 'inactive';
  schoolId: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  teacherId: string;
  teacherName: string;
  capacity: number;
  enrolledStudents: number;
  schedule: CourseSchedule[];
  termId: string;
  status: 'active' | 'inactive';
  schoolId: string;
}

export interface CourseSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  room: string;
}

export interface Exam {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  date: Date;
  startTime: string;
  endTime: string;
  room: string;
  type: 'midterm' | 'final' | 'quiz' | 'assignment';
  totalMarks: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  schoolId: string;
}

export interface Term {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  type: 'fall' | 'spring' | 'summer';
  year: number;
  schoolId: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  type: 'course' | 'exam' | 'holiday' | 'event';
  courseId?: string;
  examId?: string;
  color: string;
  description?: string;
  schoolId: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalExams: number;
  activeTerms: number;
  upcomingExams: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'teacher' | 'student';
  schoolId?: string;
  studentId?: string;
  teacherId?: string;
  isActive: boolean;
  lastLogin?: Date;
}

export interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  principalName: string;
  establishedYear: number;
  totalStudents: number;
  totalTeachers: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  currentSchool: School | null;
}