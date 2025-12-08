import localforage from "localforage";

localforage.config({
  name: "flipbookLocalDB",
  storeName: "pdfStore",
});

// Save PDF file (Blob) in IndexedDB
export async function savePDF(id, file) {
  return await localforage.setItem(id, file);
}

// Load PDF file by ID
export async function getPDF(id) {
  return await localforage.getItem(id);
}
