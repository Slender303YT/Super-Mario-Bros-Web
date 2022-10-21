export function download(filename, text, type) {
  var element = document.createElement("a");
  var xd = encodeURIComponent(text);
  element.setAttribute("href", `data:${type};charset=utf-8,${xd}`);
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export async function loadFile(file) {
  return await file.text();
}