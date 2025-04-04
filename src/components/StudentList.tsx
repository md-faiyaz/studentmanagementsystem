
import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Edit, 
  Trash2, 
  Eye 
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Student } from '@/types/student';
import { courses } from '@/data/courses';

// Function to get the course name by ID
const getCourseName = (courseId: string): string => {
  const course = courses.find(c => c.id === courseId);
  return course ? course.name : 'Unknown Course';
};

type SortField = 'name' | 'yearOfAdmission' | 'courseId';
type SortDirection = 'asc' | 'desc';

interface StudentListProps {
  students: Student[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const StudentList = ({ students, onEdit, onDelete, onView }: StudentListProps) => {
  // Filtering and sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [courseFilter, setCourseFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Generate an array of available years from the students data
  const availableYears = Array.from(
    new Set(students.map(student => student.yearOfAdmission))
  ).sort((a, b) => b - a); // Sort in descending order

  // Filter students based on search term and filters
  const filteredStudents = students.filter(student => {
    // Search by name or email
    const searchMatch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by year if selected
    const yearMatch = !yearFilter || student.yearOfAdmission.toString() === yearFilter;
    
    // Filter by course if selected
    const courseMatch = !courseFilter || student.courseId === courseFilter;
    
    return searchMatch && yearMatch && courseMatch;
  });

  // Sort filtered students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let result = 0;

    if (sortBy === 'name') {
      result = a.name.localeCompare(b.name);
    } else if (sortBy === 'yearOfAdmission') {
      result = a.yearOfAdmission - b.yearOfAdmission;
    } else if (sortBy === 'courseId') {
      result = getCourseName(a.courseId).localeCompare(getCourseName(b.courseId));
    }

    return sortDirection === 'asc' ? result : -result;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = sortedStudents.slice(startIndex, startIndex + itemsPerPage);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <div className="p-2">
                <p className="mb-2 text-sm font-medium">Year of Admission</p>
                <Select
                  value={yearFilter}
                  onValueChange={(value) => {
                    setYearFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="p-2">
                <p className="mb-2 text-sm font-medium">Course</p>
                <Select
                  value={courseFilter}
                  onValueChange={(value) => {
                    setCourseFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {paginatedStudents.length > 0 ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <button
                      className="flex items-center"
                      onClick={() => handleSort('name')}
                    >
                      Name
                      {sortBy === 'name' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )
                      ) : null}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center"
                      onClick={() => handleSort('courseId')}
                    >
                      Course
                      {sortBy === 'courseId' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )
                      ) : null}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center"
                      onClick={() => handleSort('yearOfAdmission')}
                    >
                      Year of Admission
                      {sortBy === 'yearOfAdmission' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )
                      ) : null}
                    </button>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{getCourseName(student.courseId)}</TableCell>
                    <TableCell>{student.yearOfAdmission}</TableCell>
                    <TableCell>{student.contactInfo.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(student.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(student.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination className="w-full justify-center">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-md border border-dashed p-4">
          <p className="text-center text-muted-foreground">
            {students.length === 0
              ? "No students found. Add a student to get started."
              : "No students match your search criteria."}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentList;
