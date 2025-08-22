import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DriverCard from '../../components/DriverCard';

const mockDriver = {
  id: 1,
  name: 'Juan Pérez',
  email: 'juan@example.com',
  phone: '+1234567890',
  status: 'active',
  licenseNumber: 'ABC123',
  vehicleId: 1,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('DriverCard Component', () => {
  it('renders driver information correctly', () => {
    const { getByText } = render(
      <DriverCard 
        driver={mockDriver} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    expect(getByText('Juan Pérez')).toBeTruthy();
    expect(getByText('juan@example.com')).toBeTruthy();
    expect(getByText('+1234567890')).toBeTruthy();
    expect(getByText('ABC123')).toBeTruthy();
  });

  it('calls onEdit when edit button is pressed', () => {
    const mockOnEdit = jest.fn();
    const { getByTestId } = render(
      <DriverCard 
        driver={mockDriver} 
        onEdit={mockOnEdit} 
        onDelete={() => {}} 
      />
    );
    
    fireEvent.press(getByTestId('edit-button'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockDriver);
  });

  it('calls onDelete when delete button is pressed', () => {
    const mockOnDelete = jest.fn();
    const { getByTestId } = render(
      <DriverCard 
        driver={mockDriver} 
        onEdit={() => {}} 
        onDelete={mockOnDelete} 
      />
    );
    
    fireEvent.press(getByTestId('delete-button'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockDriver.id);
  });

  it('displays correct status badge', () => {
    const { getByText } = render(
      <DriverCard 
        driver={mockDriver} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    expect(getByText('Activo')).toBeTruthy();
  });
});