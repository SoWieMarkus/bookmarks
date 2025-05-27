import createHttpError from "http-errors";
import sharp from "sharp";

export const resizeImage = async (base64image: string) => {
    const matches = base64image.match(/^data:image\/([a-z]+);base64,(.*)$/);
    if (!matches || matches.length !== 3) {
        throw createHttpError(400, "Invalid base64 image format");
    }
    const imageType = matches[1];
    const imageData = matches[2];
    const buffer = Buffer.from(imageData, "base64");
    const resizedImageBuffer = await sharp(buffer).resize(200, 200).toBuffer();
    return `data:image/${imageType};base64,${resizedImageBuffer.toString("base64")}`;
}