
export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type Course = {
  id: string;
  name: string;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
};

export type ContactInfo = {
  phone: string;
  email: string;
};

export type Student = {
  id: string;
  name: string;
  gender: Gender;
  dateOfBirth: Date;
  yearOfAdmission: number;
  courseId: string;
  address: Address;
  contactInfo: ContactInfo;
};

export type StudentFormData = Omit<Student, 'id' | 'dateOfBirth'> & {
  dateOfBirth: string;
};
