const fileType = {
    "document": ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "txt", "rtf", "odt", "ods", "odp", "odg", "odf", "odc", "odb", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots"],
    "image": ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "heic", "heif"]
}

export const IMAGE = "image";
export const DOCUMENT = "document";
export const OTHER = "other";

export const isImage = (ext) => {
    return fileType.image.includes(ext);
}

export const isDocument = (ext) => {
    return fileType.document.includes(ext);
}

export const getFileType = (ext) => {
    if (isDocument(ext)) return DOCUMENT;
    return isImage(ext) ? IMAGE : OTHER;
}