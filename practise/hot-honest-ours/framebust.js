// Loaded first, as a plain blocking script (not a module), so it runs as
// early as possible. This is the V1 substitute for the `frame-ancestors`
// CSP directive, which cannot be set until the domain is proxied and can
// send real response headers -- see docs/spec/hot-honest-ours-privacy-
// architecture.md §9.3 and §0.1. Real protection against an ordinary
// embedding page; bypassable by a sandboxed iframe lacking
// allow-top-navigation, a gap that closes once the proxy ships.
(function () {
  try {
    if (window.top !== window.self) {
      window.top.location = window.self.location;
    }
  } catch (e) {
    // A cross-origin framing page can throw reading window.top.location
    // in some browsers; nothing further to do from in here.
  }
})();
