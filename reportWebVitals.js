/**
 * reportWebVitals function tracks and reports key web performance metrics.
 * 
 * <p>This function dynamically imports the `web-vitals` library and retrieves 
 * several performance metrics, including:</p>
 * - **Cumulative Layout Shift (CLS):** Measures visual stability.
 * - **First Input Delay (FID):** Measures interactivity.
 * - **First Contentful Paint (FCP):** Measures the time when the first content is visible.
 * - **Largest Contentful Paint (LCP):** Measures loading performance.
 * - **Time to First Byte (TTFB):** Measures the time taken to receive the first byte from the server.
 * 
 * <p>If the `onPerfEntry` parameter is a valid function, it will invoke the 
 * corresponding web vitals metrics with the provided function.</p>
 * 
 * Dependencies:
 * - web-vitals library for measuring web performance metrics.
 * 
 * @param onPerfEntry A callback function to handle the performance metrics.
 * @return {void} This function does not return a value.
 * 
 * @version 1.0
 * @since [15/09/2024]
 */

const reportWebVitals = (onPerfEntry) => {
  // Ensure the provided onPerfEntry is a function before proceeding.
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import the web-vitals library and measure performance metrics.
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);   // Measure Cumulative Layout Shift (CLS)
      getFID(onPerfEntry);    // Measure First Input Delay (FID)
      getFCP(onPerfEntry);    // Measure First Contentful Paint (FCP)
      getLCP(onPerfEntry);    // Measure Largest Contentful Paint (LCP)
      getTTFB(onPerfEntry);   // Measure Time to First Byte (TTFB)
    });
  }
};

export default reportWebVitals;
