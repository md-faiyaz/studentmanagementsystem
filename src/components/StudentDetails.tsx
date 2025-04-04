
import { format } from 'date-fns';
import { Student } from '@/types/student';
import { courses } from '@/data/courses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface StudentDetailsProps {
  student: Student;
}

const StudentDetails = ({ student }: StudentDetailsProps) => {
  const course = courses.find(c => c.id === student.courseId);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Full Name</p>
              <p>{student.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gender</p>
              <p>{student.gender}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
            <p>{format(student.dateOfBirth, 'MMMM d, yyyy')}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Course</p>
              <p>{course ? course.name : 'Unknown Course'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Year of Admission</p>
              <p>{student.yearOfAdmission}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{student.contactInfo.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p>{student.contactInfo.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Street</p>
            <p>{student.address.street}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">City</p>
              <p>{student.address.city}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">State</p>
              <p>{student.address.state}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Postal Code</p>
              <p>{student.address.postalCode}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetails;
