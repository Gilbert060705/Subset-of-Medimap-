/**
 * Jest DOM Configuration for Testing React Components.
 * 
 * <p>This module enhances Jest with custom matchers to perform assertions 
 * on DOM nodes when testing React components. The added matchers allow you 
 * to perform more expressive assertions, such as:</p>
 * 
 * Example:
 * <pre>
 * expect(element).toHaveTextContent(/react/i);
 * </pre>
 * 
 * <p>The matchers provided by `jest-dom` improve the readability of tests 
 * and help verify if elements in the DOM contain the expected content.</p>
 * 
 * Documentation:
 * Learn more about `jest-dom` and its matchers: 
 * https://github.com/testing-library/jest-dom
 * 
 * Dependencies:
 * - `@testing-library/jest-dom` (custom matchers for DOM assertions)
 * 
 * @version 1.0
 * @since [15/09/2024]
 */

// Import custom Jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';
