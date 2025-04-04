import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Student, StudentFormData } from '../types/student';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface StudentContextType {
  students: Student[];
  addStudent: (student: StudentFormData) => void;
  updateStudent: (id: string, updatedStudent: StudentFormData) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};

interface StudentProviderProps {
  children: ReactNode;
}

export const StudentProvider: React.FC<StudentProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);

  const addStudent = (studentData: StudentFormData) => {
    try {
      const newStudent: Student = {
        ...studentData,
        id: uuidv4(),
        dateOfBirth: new Date(studentData.dateOfBirth),
      };

      setStudents((prevStudents) => [...prevStudents, newStudent]);
      toast.success('Student added successfully');
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student');
    }
  };

  const updateStudent = (id: string, updatedStudentData: StudentFormData) => {
    try {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === id
            ? {
                ...updatedStudentData,
                id,
                dateOfBirth: new Date(updatedStudentData.dateOfBirth),
              }
            : student
        )
      );
      toast.success('Student updated successfully');
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
    }
  };

  const deleteStudent = (id: string) => {
    try {
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== id)
      );
      toast.success('Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    }
  };

  const getStudentById = (id: string) => {
    return students.find((student) => student.id === id);
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentById,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
