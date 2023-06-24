import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Priority from '../components/Priority';

test('should render priority', () => {
    render(<Priority />);
    const priorityElement = screen.getByTestId('priority');
    expect(priorityElement).toBeInTheDocument();
})