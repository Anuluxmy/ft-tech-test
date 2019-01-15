# FT Tech Test - Michael Allen

This tech test is deployed at https://ft-tech-test-michaeldfallen.herokuapp.com.

## Requirements

- [x] Server-side rendered
- [x] Responsive
- [x] Accessible
- [x] Built using Javascript and node.js
- [x] Not reliant on client-side frameworks (i.e. Angular, React) or libraries like jQuery
- [x] Uses Origami Components
- [x] Progressively enhanced
- [x] Deployed on Heroku
- [x] Have a similar look and feel as ft.com
- [x] Performs well over 3G networks
- [x] Works offline

## Note on working offline

This was my first use of a service worker so I don't think I've set it up entirely
correctly. It requires a refresh after the initial load so the requests are cached.

After that first reload it will work offline.

The service worker is set up to fallback to cache if the network takes longer than
400ms, ensuring quick response on mobile, while caching the result once it arrives
so the user will get it on next refresh.
