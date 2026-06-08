import Swal from 'sweetalert2';

/**
 * Themed SweetAlert2 instance for Phoenix Cargo.
 * Matches the fire/ash dark luxury design system.
 */
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#1c1a18',
  color: '#e8e4df',
  customClass: {
    popup: 'swal-toast-popup',
    timerProgressBar: 'swal-timer-bar',
  },
  didOpen: (t) => {
    t.onmouseenter = Swal.stopTimer;
    t.onmouseleave = Swal.resumeTimer;
  },
});

/** Show a themed success toast */
export const toastSuccess = (title: string) =>
  Toast.fire({ icon: 'success', title, iconColor: '#e8610a' });

/** Show a themed error toast */
export const toastError = (title: string) =>
  Toast.fire({ icon: 'error', title, iconColor: '#c93a1e' });

/** Show a themed warning toast */
export const toastWarning = (title: string) =>
  Toast.fire({ icon: 'warning', title, iconColor: '#f4960c' });

/** Show a themed info toast */
export const toastInfo = (title: string) =>
  Toast.fire({ icon: 'info', title, iconColor: '#e8610a' });

/**
 * Full-screen themed confirm dialog (for destructive / important actions).
 */
export const confirmDialog = (opts: {
  title: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: 'warning' | 'question' | 'info';
}) =>
  Swal.fire({
    title: opts.title,
    text: opts.text,
    icon: opts.icon ?? 'warning',
    showCancelButton: true,
    confirmButtonText: opts.confirmText ?? 'Confirm',
    cancelButtonText: opts.cancelText ?? 'Cancel',
    background: '#1c1a18',
    color: '#e8e4df',
    confirmButtonColor: '#e8610a',
    cancelButtonColor: '#413d39',
    iconColor: '#f4960c',
    customClass: {
      popup: 'swal-popup-themed',
    },
  });

/**
 * Full-screen success modal (e.g. after form submission).
 */
export const successModal = (title: string, text?: string) =>
  Swal.fire({
    title,
    text,
    icon: 'success',
    background: '#1c1a18',
    color: '#e8e4df',
    confirmButtonColor: '#e8610a',
    iconColor: '#e8610a',
    confirmButtonText: 'OK',
  });

export default Swal;
