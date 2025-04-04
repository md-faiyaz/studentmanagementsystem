
import { useState } from 'react';
import { 
  UserPlus, 
  GraduationCap, 
  Users 
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import { useStudents } from '@/context/StudentContext';
import StudentForm from '@/components/StudentForm';
import StudentList from '@/components/StudentList';
import StudentDetails from '@/components/StudentDetails';
import { StudentFormData } from '@/types/student';

const Index = () => {
  const { students, addStudent, updateStudent, deleteStudent, getStudentById } = useStudents();
  
  // State for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Functions to handle student operations
  const handleAddStudent = (data: StudentFormData) => {
    addStudent(data);
    setIsAddDialogOpen(false);
  };

  const handleEditStudent = (data: StudentFormData) => {
    if (selectedStudentId) {
      updateStudent(selectedStudentId, data);
      setIsEditDialogOpen(false);
      setSelectedStudentId(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedStudentId) {
      deleteStudent(selectedStudentId);
      setIsDeleteDialogOpen(false);
      setSelectedStudentId(null);
    }
  };

  // Functions to open dialogs
  const openAddDialog = () => setIsAddDialogOpen(true);
  
  const openEditDialog = (id: string) => {
    setSelectedStudentId(id);
    setIsEditDialogOpen(true);
  };
  
  const openViewDialog = (id: string) => {
    setSelectedStudentId(id);
    setIsViewDialogOpen(true);
  };
  
  const openDeleteDialog = (id: string) => {
    setSelectedStudentId(id);
    setIsDeleteDialogOpen(true);
  };

  // Get the selected student for edit, view, or delete operations
  const selectedStudent = selectedStudentId ? getStudentById(selectedStudentId) : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold flex items-center">
              <GraduationCap className="mr-2 h-8 w-8" />
              Student Management System
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage student records with ease
            </p>
          </div>
          <Button onClick={openAddDialog} className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Student
          </Button>
        </div>
      </header>

      <main>
        <div className="mb-6 flex items-center">
          <Users className="mr-2 h-5 w-5" />
          <h2 className="text-xl font-semibold">Student Records</h2>
          <div className="ml-auto text-sm text-muted-foreground">
            Total: {students.length} students
          </div>
        </div>

        <StudentList
          students={students}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onView={openViewDialog}
        />
      </main>

      {/* Add Student Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter the student's information below.
            </DialogDescription>
          </DialogHeader>
          <StudentForm
            onSubmit={handleAddStudent}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the student's information.
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <StudentForm
              student={selectedStudent}
              onSubmit={handleEditStudent}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Student Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && <StudentDetails student={selectedStudent} />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this student? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
