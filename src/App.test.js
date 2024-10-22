/**
 * Unit test for the `App` component using React Testing Library.
 * 
 * <p>This test ensures that the "learn react" link is rendered correctly
 * in the `App` component. The goal is to verify that the component behaves
 * as expected by checking the presence of specific text.</p>
 *
 * Dependencies:
 * - @testing-library/react
 * - Jest (for running tests)
 * - App component
 * 
 * Test Case:
 * - Renders the "learn react" link and ensures it is present in the document.
 * 
 * @author [Group1]
 * @version 1.0
 */

import { render, screen } from '@testing-library/react'; // Import necessary testing functions
import App from './App'; // Import the App component

/**
 * Test case to verify that the "learn react" link is rendered within the App component.
 * 
 * <p>This test uses `render` to render the App component, and `screen` to query the
 * rendered output for the presence of the link. The assertion ensures that the link is
 * present in the document.</p>
 */
test('renders learn react link', () => {
    // Render the App component
    render(<App />);

    // Find the element with the text "learn react" (case insensitive)
    const linkElement = screen.getByText(/learn react/i);

    // Assert that the element is present in the document
    expect(linkElement).toBeInTheDocument();
});
