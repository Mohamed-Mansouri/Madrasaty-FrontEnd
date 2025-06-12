import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Student, Teacher, Personnel, Course, Exam, Term, CalendarEvent, DashboardStats } from '../models/interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private studentsSubject = new BehaviorSubject<Student[]>(this.getInitialStudents());
  private teachersSubject = new BehaviorSubject<Teacher[]>(this.getInitialTeachers());
  private personnelSubject = new BehaviorSubject<Personnel[]>(this.getInitialPersonnel());
  private coursesSubject = new BehaviorSubject<Course[]>(this.getInitialCourses());
  private examsSubject = new BehaviorSubject<Exam[]>(this.getInitialExams());
  private termsSubject = new BehaviorSubject<Term[]>(this.getInitialTerms());

  public students$ = this.studentsSubject.asObservable();
  public teachers$ = this.teachersSubject.asObservable();
  public personnel$ = this.personnelSubject.asObservable();
  public courses$ = this.coursesSubject.asObservable();
  public exams$ = this.examsSubject.asObservable();
  public terms$ = this.termsSubject.asObservable();

  constructor(private authService: AuthService) {}

  private filterBySchool<T extends { schoolId: string }>(items: T[]): T[] {
    const currentSchool = this.authService.getCurrentSchool();
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentSchool) return [];
    
    // Super admin can see all data for selected school
    if (currentUser?.role === 'super_admin') {
      return items.filter(item => item.schoolId === currentSchool.id);
    }
    
    // Other users can only see data from their school
    return items.filter(item => item.schoolId === currentUser?.schoolId);
  }

  private filterByUserRole<T extends { schoolId: string }>(items: T[]): T[] {
    const currentUser = this.authService.getCurrentUser();
    const filteredItems = this.filterBySchool(items);
    
    // Students and teachers see filtered data based on their role
    if (currentUser?.role === 'student') {
      // Students see only their own data or courses they're enrolled in
      return filteredItems; // Additional filtering would be done in specific methods
    }
    
    if (currentUser?.role === 'teacher') {
      // Teachers see their courses and students
      return filteredItems; // Additional filtering would be done in specific methods
    }
    
    return filteredItems;
  }

  // Students
  getStudents(): Observable<Student[]> {
    return this.students$.pipe(
      map(students => this.filterByUserRole(students))
    );
  }

  getMyStudents(): Observable<Student[]> {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.role !== 'teacher') return of([]);
    
    return this.students$.pipe(
      map(students => {
        const filteredStudents = this.filterBySchool(students);
        // Filter students enrolled in teacher's courses
        return filteredStudents.filter(student => 
          student.classes.some(classId => 
            this.coursesSubject.value.some(course => 
              course.id === classId && course.teacherId === currentUser.teacherId
            )
          )
        );
      })
    );
  }

  addStudent(student: Omit<Student, 'id'>): Observable<Student> {
    const currentSchool = this.authService.getCurrentSchool();
    if (!currentSchool) throw new Error('No school selected');
    
    const newStudent: Student = {
      ...student,
      id: this.generateId(),
      schoolId: currentSchool.id
    };
    const currentStudents = this.studentsSubject.value;
    this.studentsSubject.next([...currentStudents, newStudent]);
    return of(newStudent);
  }

  updateStudent(id: string, student: Partial<Student>): Observable<Student> {
    const currentStudents = this.studentsSubject.value;
    const index = currentStudents.findIndex(s => s.id === id);
    if (index !== -1) {
      const updatedStudent = { ...currentStudents[index], ...student };
      const updatedStudents = [...currentStudents];
      updatedStudents[index] = updatedStudent;
      this.studentsSubject.next(updatedStudents);
      return of(updatedStudent);
    }
    throw new Error('Student not found');
  }

  deleteStudent(id: string): Observable<boolean> {
    const currentStudents = this.studentsSubject.value;
    const filteredStudents = currentStudents.filter(s => s.id !== id);
    this.studentsSubject.next(filteredStudents);
    return of(true);
  }

  // Teachers
  getTeachers(): Observable<Teacher[]> {
    return this.teachers$.pipe(
      map(teachers => this.filterByUserRole(teachers))
    );
  }

  addTeacher(teacher: Omit<Teacher, 'id'>): Observable<Teacher> {
    const currentSchool = this.authService.getCurrentSchool();
    if (!currentSchool) throw new Error('No school selected');
    
    const newTeacher: Teacher = {
      ...teacher,
      id: this.generateId(),
      schoolId: currentSchool.id
    };
    const currentTeachers = this.teachersSubject.value;
    this.teachersSubject.next([...currentTeachers, newTeacher]);
    return of(newTeacher);
  }

  updateTeacher(id: string, teacher: Partial<Teacher>): Observable<Teacher> {
    const currentTeachers = this.teachersSubject.value;
    const index = currentTeachers.findIndex(t => t.id === id);
    if (index !== -1) {
      const updatedTeacher = { ...currentTeachers[index], ...teacher };
      const updatedTeachers = [...currentTeachers];
      updatedTeachers[index] = updatedTeacher;
      this.teachersSubject.next(updatedTeachers);
      return of(updatedTeacher);
    }
    throw new Error('Teacher not found');
  }

  deleteTeacher(id: string): Observable<boolean> {
    const currentTeachers = this.teachersSubject.value;
    const filteredTeachers = currentTeachers.filter(t => t.id !== id);
    this.teachersSubject.next(filteredTeachers);
    return of(true);
  }

  // Personnel
  getPersonnel(): Observable<Personnel[]> {
    return this.personnel$.pipe(
      map(personnel => this.filterByUserRole(personnel))
    );
  }

  addPersonnel(personnel: Omit<Personnel, 'id'>): Observable<Personnel> {
    const currentSchool = this.authService.getCurrentSchool();
    if (!currentSchool) throw new Error('No school selected');
    
    const newPersonnel: Personnel = {
      ...personnel,
      id: this.generateId(),
      schoolId: currentSchool.id
    };
    const currentPersonnel = this.personnelSubject.value;
    this.personnelSubject.next([...currentPersonnel, newPersonnel]);
    return of(newPersonnel);
  }

  // Courses
  getCourses(): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => this.filterByUserRole(courses))
    );
  }

  getMyCourses(): Observable<Course[]> {
    const currentUser = this.authService.getCurrentUser();
    
    return this.courses$.pipe(
      map(courses => {
        const filteredCourses = this.filterBySchool(courses);
        
        if (currentUser?.role === 'teacher') {
          return filteredCourses.filter(course => course.teacherId === currentUser.teacherId);
        }
        
        if (currentUser?.role === 'student') {
          const student = this.studentsSubject.value.find(s => s.id === currentUser.studentId);
          if (student) {
            return filteredCourses.filter(course => student.classes.includes(course.id));
          }
        }
        
        return filteredCourses;
      })
    );
  }

  addCourse(course: Omit<Course, 'id'>): Observable<Course> {
    const currentSchool = this.authService.getCurrentSchool();
    if (!currentSchool) throw new Error('No school selected');
    
    const newCourse: Course = {
      ...course,
      id: this.generateId(),
      schoolId: currentSchool.id
    };
    const currentCourses = this.coursesSubject.value;
    this.coursesSubject.next([...currentCourses, newCourse]);
    return of(newCourse);
  }

  // Exams
  getExams(): Observable<Exam[]> {
    return this.exams$.pipe(
      map(exams => this.filterByUserRole(exams))
    );
  }

  getMyExams(): Observable<Exam[]> {
    const currentUser = this.authService.getCurrentUser();
    
    return this.exams$.pipe(
      map(exams => {
        const filteredExams = this.filterBySchool(exams);
        
        if (currentUser?.role === 'teacher') {
          const teacherCourses = this.coursesSubject.value
            .filter(course => course.teacherId === currentUser.teacherId)
            .map(course => course.id);
          return filteredExams.filter(exam => teacherCourses.includes(exam.courseId));
        }
        
        if (currentUser?.role === 'student') {
          const student = this.studentsSubject.value.find(s => s.id === currentUser.studentId);
          if (student) {
            return filteredExams.filter(exam => student.classes.includes(exam.courseId));
          }
        }
        
        return filteredExams;
      })
    );
  }

  addExam(exam: Omit<Exam, 'id'>): Observable<Exam> {
    const currentSchool = this.authService.getCurrentSchool();
    if (!currentSchool) throw new Error('No school selected');
    
    const newExam: Exam = {
      ...exam,
      id: this.generateId(),
      schoolId: currentSchool.id
    };
    const currentExams = this.examsSubject.value;
    this.examsSubject.next([...currentExams, newExam]);
    return of(newExam);
  }

  // Terms
  getTerms(): Observable<Term[]> {
    return this.terms$.pipe(
      map(terms => this.filterByUserRole(terms))
    );
  }

  addTerm(term: Omit<Term, 'id'>): Observable<Term> {
    const currentSchool = this.authService.getCurrentSchool();
    if (!currentSchool) throw new Error('No school selected');
    
    const newTerm: Term = {
      ...term,
      id: this.generateId(),
      schoolId: currentSchool.id
    };
    const currentTerms = this.termsSubject.value;
    this.termsSubject.next([...currentTerms, newTerm]);
    return of(newTerm);
  }

  // Calendar Events
  getCalendarEvents(month: number, year: number): Observable<CalendarEvent[]> {
    const events: CalendarEvent[] = [];
    const courses = this.filterByUserRole(this.coursesSubject.value);
    const exams = this.filterByUserRole(this.examsSubject.value);
    const currentSchool = this.authService.getCurrentSchool();
    
    if (!currentSchool) return of([]);

    // Add course events
    courses.forEach(course => {
      course.schedule.forEach(schedule => {
        const event: CalendarEvent = {
          id: `course-${course.id}-${schedule.dayOfWeek}`,
          title: course.name,
          date: new Date(),
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          type: 'course',
          courseId: course.id,
          color: '#1976D2',
          schoolId: currentSchool.id
        };
        events.push(event);
      });
    });

    // Add exam events
    exams.forEach(exam => {
      const event: CalendarEvent = {
        id: `exam-${exam.id}`,
        title: `${exam.title} (${exam.type})`,
        date: exam.date,
        startTime: exam.startTime,
        endTime: exam.endTime,
        type: 'exam',
        examId: exam.id,
        color: '#FB8C00',
        schoolId: currentSchool.id
      };
      events.push(event);
    });

    return of(events);
  }

  // Dashboard Stats
  getDashboardStats(): Observable<DashboardStats> {
    const students = this.filterByUserRole(this.studentsSubject.value);
    const teachers = this.filterByUserRole(this.teachersSubject.value);
    const courses = this.filterByUserRole(this.coursesSubject.value);
    const exams = this.filterByUserRole(this.examsSubject.value);
    const terms = this.filterByUserRole(this.termsSubject.value);

    const stats: DashboardStats = {
      totalStudents: students.filter(s => s.status === 'active').length,
      totalTeachers: teachers.filter(t => t.status === 'active').length,
      totalCourses: courses.filter(c => c.status === 'active').length,
      totalExams: exams.length,
      activeTerms: terms.filter(t => t.isActive).length,
      upcomingExams: exams.filter(e => e.status === 'scheduled' && new Date(e.date) > new Date()).length
    };

    return of(stats);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getInitialStudents(): Student[] {
    return [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0101',
        dateOfBirth: new Date('2005-03-15'),
        enrollmentDate: new Date('2023-09-01'),
        studentId: 'STU001',
        grade: '12',
        classes: ['MATH101', 'ENG101', 'SCI101'],
        status: 'active',
        schoolId: '1'
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phone: '+1-555-0102',
        dateOfBirth: new Date('2005-07-22'),
        enrollmentDate: new Date('2023-09-01'),
        studentId: 'STU002',
        grade: '11',
        classes: ['MATH101', 'HIST101', 'ART101'],
        status: 'active',
        schoolId: '1'
      },
      {
        id: '3',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@email.com',
        phone: '+1-555-0103',
        dateOfBirth: new Date('2004-11-08'),
        enrollmentDate: new Date('2023-09-01'),
        studentId: 'STU003',
        grade: '12',
        classes: ['SCI101', 'ENG101', 'PHYS101'],
        status: 'active',
        schoolId: '1'
      }
    ];
  }

  private getInitialTeachers(): Teacher[] {
    return [
      {
        id: '1',
        firstName: 'Dr. Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@school.edu',
        phone: '+1-555-0201',
        employeeId: 'TEA001',
        department: 'Mathematics',
        subjects: ['Algebra', 'Calculus', 'Statistics'],
        hireDate: new Date('2020-08-15'),
        status: 'active',
        schoolId: '1'
      },
      {
        id: '2',
        firstName: 'Prof. Robert',
        lastName: 'Brown',
        email: 'robert.brown@school.edu',
        phone: '+1-555-0202',
        employeeId: 'TEA002',
        department: 'Science',
        subjects: ['Physics', 'Chemistry', 'Biology'],
        hireDate: new Date('2019-01-10'),
        status: 'active',
        schoolId: '1'
      },
      {
        id: '3',
        firstName: 'Ms. Emily',
        lastName: 'Davis',
        email: 'emily.davis@school.edu',
        phone: '+1-555-0203',
        employeeId: 'TEA003',
        department: 'English',
        subjects: ['Literature', 'Writing', 'Grammar'],
        hireDate: new Date('2021-09-01'),
        status: 'active',
        schoolId: '1'
      }
    ];
  }

  private getInitialPersonnel(): Personnel[] {
    return [
      {
        id: '1',
        firstName: 'Michael',
        lastName: 'Anderson',
        email: 'michael.anderson@school.edu',
        phone: '+1-555-0301',
        employeeId: 'PER001',
        position: 'Principal',
        department: 'Administration',
        hireDate: new Date('2018-07-01'),
        status: 'active',
        schoolId: '1'
      },
      {
        id: '2',
        firstName: 'Lisa',
        lastName: 'Martinez',
        email: 'lisa.martinez@school.edu',
        phone: '+1-555-0302',
        employeeId: 'PER002',
        position: 'Librarian',
        department: 'Library',
        hireDate: new Date('2020-03-15'),
        status: 'active',
        schoolId: '1'
      }
    ];
  }

  private getInitialCourses(): Course[] {
    return [
      {
        id: '1',
        name: 'Advanced Mathematics',
        code: 'MATH101',
        description: 'Advanced mathematical concepts including calculus and algebra',
        credits: 4,
        teacherId: '1',
        teacherName: 'Dr. Sarah Wilson',
        capacity: 30,
        enrolledStudents: 25,
        schedule: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '10:30', room: 'Room 101' },
          { dayOfWeek: 3, startTime: '09:00', endTime: '10:30', room: 'Room 101' },
          { dayOfWeek: 5, startTime: '09:00', endTime: '10:30', room: 'Room 101' }
        ],
        termId: '1',
        status: 'active',
        schoolId: '1'
      },
      {
        id: '2',
        name: 'English Literature',
        code: 'ENG101',
        description: 'Study of classic and contemporary literature',
        credits: 3,
        teacherId: '3',
        teacherName: 'Ms. Emily Davis',
        capacity: 25,
        enrolledStudents: 22,
        schedule: [
          { dayOfWeek: 2, startTime: '10:00', endTime: '11:30', room: 'Room 201' },
          { dayOfWeek: 4, startTime: '10:00', endTime: '11:30', room: 'Room 201' }
        ],
        termId: '1',
        status: 'active',
        schoolId: '1'
      },
      {
        id: '3',
        name: 'Physics',
        code: 'PHYS101',
        description: 'Introduction to physics principles and laboratory work',
        credits: 4,
        teacherId: '2',
        teacherName: 'Prof. Robert Brown',
        capacity: 20,
        enrolledStudents: 18,
        schedule: [
          { dayOfWeek: 1, startTime: '14:00', endTime: '15:30', room: 'Lab 301' },
          { dayOfWeek: 3, startTime: '14:00', endTime: '15:30', room: 'Lab 301' }
        ],
        termId: '1',
        status: 'active',
        schoolId: '1'
      }
    ];
  }

  private getInitialExams(): Exam[] {
    return [
      {
        id: '1',
        title: 'Midterm Examination',
        courseId: '1',
        courseName: 'Advanced Mathematics',
        date: new Date('2024-02-15'),
        startTime: '09:00',
        endTime: '11:00',
        room: 'Exam Hall A',
        type: 'midterm',
        totalMarks: 100,
        status: 'scheduled',
        schoolId: '1'
      },
      {
        id: '2',
        title: 'Literature Analysis',
        courseId: '2',
        courseName: 'English Literature',
        date: new Date('2024-02-20'),
        startTime: '10:00',
        endTime: '12:00',
        room: 'Room 201',
        type: 'assignment',
        totalMarks: 50,
        status: 'scheduled',
        schoolId: '1'
      },
      {
        id: '3',
        title: 'Physics Lab Practical',
        courseId: '3',
        courseName: 'Physics',
        date: new Date('2024-02-25'),
        startTime: '14:00',
        endTime: '16:00',
        room: 'Lab 301',
        type: 'final',
        totalMarks: 75,
        status: 'scheduled',
        schoolId: '1'
      }
    ];
  }

  private getInitialTerms(): Term[] {
    return [
      {
        id: '1',
        name: 'Spring 2024',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-05-15'),
        isActive: true,
        type: 'spring',
        year: 2024,
        schoolId: '1'
      },
      {
        id: '2',
        name: 'Fall 2023',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-12-20'),
        isActive: false,
        type: 'fall',
        year: 2023,
        schoolId: '1'
      }
    ];
  }
}