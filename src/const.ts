export const allTypes = ["png", "jpeg", "webp"];
export const acceptedQualityFormat = allTypes.filter((t) => t !== "png");
export const acceptedFormats = allTypes.join(", ");
