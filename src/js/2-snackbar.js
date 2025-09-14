import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', evt => {
  evt.preventDefault();

  const formData = new FormData(form);
  const delay = Number((formData.get('delay') ?? '').toString().trim());
  const state = formData.get('state');

  if (
    !Number.isFinite(delay) ||
    delay < 0 ||
    (state !== 'fulfilled' && state !== 'rejected')
  ) {
    iziToast.error({
      message: 'Please provide valid delay and state',
      position: 'topRight',
    });
    return;
  }

  // Створюємо проміс
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      state === 'fulfilled' ? resolve(delay) : reject(delay);
    }, delay);
  });

  promise
    .then(d => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${d}ms`,
        position: 'topRight',
      });
    })
    .catch(d => {
      iziToast.error({
        message: `❌ Rejected promise in ${d}ms`,
        position: 'topRight',
      });
    });

  form.reset();
});
