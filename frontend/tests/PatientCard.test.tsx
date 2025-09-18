import { render, screen, fireEvent } from '@testing-library/react';
import PatientCard from '../components/patients/PatientCard';

const mockPatient = {
  id: 1,
  mrn: 'MRN1000001',
  full_name: 'John Doe',
  age: 45,
  gender: 'Male',
  insurance: 'Medicare',
  allergies: ['Penicillin', 'Latex'],
  activeAlerts: 2,
};

describe('PatientCard', () => {
  test('renders patient information correctly', () => {
    const mockOnClick = jest.fn();

    render(<PatientCard patient={mockPatient} onClick={mockOnClick} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('MRN: MRN1000001')).toBeInTheDocument();
    expect(screen.getByText('45y, Male')).toBeInTheDocument();
    expect(screen.getByText('Insurance: Medicare')).toBeInTheDocument();
  });

  test('displays allergy warning when patient has allergies', () => {
    const mockOnClick = jest.fn();

    render(<PatientCard patient={mockPatient} onClick={mockOnClick} />);

    expect(screen.getByText(/Allergies: Penicillin, Latex/)).toBeInTheDocument();
  });

  test('calls onClick when card is clicked', () => {
    const mockOnClick = jest.fn();

    render(<PatientCard patient={mockPatient} onClick={mockOnClick} />);

    fireEvent.click(screen.getByText('John Doe'));

    expect(mockOnClick).toHaveBeenCalledWith(mockPatient);
  });
});
