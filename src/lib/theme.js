/** Dark mode from 19:00 to 06:59, light mode otherwise (local time). */
export function getThemeFromTimeOfDay(date = new Date()) {
  const hour = date.getHours();
  const isNight = hour >= 19 || hour < 7;
  return isNight ? 'dark' : 'light';
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}
