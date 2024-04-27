import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import RegisterBusiness from "../pages/RegisterBusiness";

describe('RegisterBusiness Component', () => {
  it('should render the registration form', () => {
    render(<RegisterBusiness />);

    expect(screen.getByText('Welcome to our website!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Lastname')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Business Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText("Already have an account? Login")).toBeInTheDocument();
  });

  it('should show/hide password on eye icon click', () => {
    render(<RegisterBusiness />);

    fireEvent.click(screen.getAllByRole('button', { name: /eye/i })[0]);
    expect(screen.getByPlaceholderText('Password').type).toBe('text');

    fireEvent.click(screen.getAllByRole('button', { name: /eye/i })[1]);
    expect(screen.getByPlaceholderText('Confirm Password').type).toBe('text');
  });

  it('should submit the form with valid data', async () => {
    render(<RegisterBusiness />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Lastname'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Business Name'), { target: { value: 'ABC Corp' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Sign Up'));

    // Use waitFor to wait for the async validation and redirection
    await waitFor(() => {
      expect(screen.getByText('Business Registration successfull')).toBeInTheDocument();
    });
  });

  it('should display error message if passwords do not match', () => {
    render(<RegisterBusiness />);

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'differentpassword' } });

    fireEvent.click(screen.getByText('Sign Up'));

    expect(screen.getByText('Passwords don\'t match')).toBeInTheDocument();
  });

  it('should display error message if any field is empty', () => {
    render(<RegisterBusiness />);

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Lastname'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Business Name'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '' } });

    fireEvent.click(screen.getByText('Sign Up'));

    expect(screen.getByText('Please fill all inputs')).toBeInTheDocument();
  });

 
});
