import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

let container = document.getElementById('root');
if (!container) {
	// Defensive: create the root container if it was removed or missing
	// This prevents createRoot from throwing and results in a white page.
	console.warn('[main.jsx] #root element not found - creating fallback root');
	const fallback = document.createElement('div');
	fallback.id = 'root';
	document.body.appendChild(fallback);
	container = fallback;
}

try {
	const root = createRoot(container);
	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
} catch (err) {
	// Log error and render a minimal error message so the page is not blank
	// This helps debugging when components throw during initial render.
	// eslint-disable-next-line no-console
	console.error('[main.jsx] Failed to mount App:', err);
	container.innerHTML = '<div style="padding:20px;font-family:system-ui;">An error occurred while loading the app. Check the console for details.</div>';
}
