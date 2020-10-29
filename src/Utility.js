export const focusFirstAvailable = parent => {
    const focusables = parent.current.querySelectorAll('input, textarea, button, [href], select, [tabindex]:not([tabindex="-1"])');
    const focuseable = Array.from(focusables).find(element => window.getComputedStyle(element).display !== "none");
    if (focuseable) {
        focuseable.focus();
    }
}