import { reloadAuthorized } from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.

export function getAuthority(str) {
  const authorityString =
    typeof str === 'undefined' && localStorage
      ? localStorage.getItem('data-platform-authority')
      : str;

  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  }

  return authority;
}
export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('data-platform-authority', JSON.stringify(proAuthority));
  reloadAuthorized();
}

export function setJwtInfo(obj) {
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    localStorage.setItem('admin-console-jwt', JSON.stringify(obj));
  }
}
export function getJwtInfo() {
  let jwtInfo = localStorage.getItem('admin-console-jwt');
  if (jwtInfo) {
    return JSON.parse(jwtInfo);
  }

  return null;
}

export function clearJwtInfo(obj) {
  localStorage.removeItem('admin-console-jwt');
}
