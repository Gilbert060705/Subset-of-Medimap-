import { render, screen } from '@testing-library/react';
import App from './App';
import AppointmentBooked from './AppointmentBooked';
import TelemedicineForm from './TelemedicineBooking';
import BookingConfirmed from './BookingConfirmed';
import Profile from './Profile';
import History from './History';

test('renders learn react link', () => {
  render(<App />);
  render(<AppointmentBooked/>);
  render(<TelemedicineForm/>);
  render(<BookingConfirmed/>);
  render(<Profile/>)
  render(<History/>)
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
