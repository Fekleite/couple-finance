const APP_NAME = "Couple Finance";

export function setPageTitle(title: string) {
  document.title = title === APP_NAME ? APP_NAME : `${title} | ${APP_NAME}`;
}
