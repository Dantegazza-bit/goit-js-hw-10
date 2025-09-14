// Бібліотеки
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// DOM
const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerId = null;

// початково кнопка вимкнена
toggleStart(false);

// Flatpickr
const fp = flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const date = selectedDates[0];

    if (!date || date.getTime() <= Date.now()) {
      toggleStart(false);
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      userSelectedDate = null;
      return;
    }

    userSelectedDate = date;
    toggleStart(true);
  },
});

// Start
refs.startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  toggleStart(false);
  refs.input.disabled = true;

  // на випадок повторного запуску
  clearInterval(timerId);

  timerId = setInterval(() => {
    const diff = userSelectedDate.getTime() - Date.now();

    if (diff <= 0) {
      clearInterval(timerId);
      updateTimer(convertMs(0));
      refs.input.disabled = false; // можна обирати нову дату
      return;
    }

    updateTimer(convertMs(diff));
  }, 1000);
});

// Helpers
function toggleStart(isEnabled) {
  refs.startBtn.disabled = !isEnabled;
}

function updateTimer({ days, hours, minutes, seconds }) {
  refs.days.textContent = String(days).padStart(2, '0');
  refs.hours.textContent = String(hours).padStart(2, '0');
  refs.minutes.textContent = String(minutes).padStart(2, '0');
  refs.seconds.textContent = String(seconds).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
