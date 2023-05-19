export const request = (method, url, data) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onerror = function () {
      reject(xhr.statusText);
    };
    xhr.send(data);
  });
};
