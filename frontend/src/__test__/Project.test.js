import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Project from '../components/Project';

test('should render project', () => {
    render(<Project name={'test'} members={['test','test']} description={'desc'} />);
    const projectElement = screen.getByTestId('project');
    expect(projectElement).toBeInTheDocument();
})