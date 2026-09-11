export const MAX_PRODUCT_IMAGE_DIMENSION = 20000;
export const RECOMMENDED_PRODUCT_IMAGE_WIDTH = 800;
export const RECOMMENDED_PRODUCT_IMAGE_HEIGHT = 1000;
export const PRODUCT_IMAGE_ASPECT_RATIO = 4 / 5;
export const PRODUCT_IMAGE_ASPECT_RATIO_TOLERANCE = 0.08;
export const PRODUCT_THUMBNAIL_MAX_WIDTH = 480;
export const PRODUCT_THUMBNAIL_MAX_HEIGHT = 600;

type ImageDimensions = {
  width: number;
  height: number;
};

export function validateProductImageDimensions({
  width,
  height,
}: ImageDimensions) {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return "Le dimensioni dell’immagine non sono valide.";
  }

  if (
    width > MAX_PRODUCT_IMAGE_DIMENSION ||
    height > MAX_PRODUCT_IMAGE_DIMENSION
  ) {
    return `L’immagine supera la dimensione massima supportata di ${MAX_PRODUCT_IMAGE_DIMENSION} px per lato.`;
  }

  return null;
}

export function getProductImageAdvisories({ width, height }: ImageDimensions) {
  const advisories: string[] = [];

  if (
    width < RECOMMENDED_PRODUCT_IMAGE_WIDTH ||
    height < RECOMMENDED_PRODUCT_IMAGE_HEIGHT
  ) {
    advisories.push(
      `Risoluzione inferiore agli ${RECOMMENDED_PRODUCT_IMAGE_WIDTH} × ${RECOMMENDED_PRODUCT_IMAGE_HEIGHT} px consigliati: l’immagine potrebbe risultare poco nitida.`,
    );
  }

  const aspectRatio = width / height;

  if (
    Math.abs(aspectRatio - PRODUCT_IMAGE_ASPECT_RATIO) >
    PRODUCT_IMAGE_ASPECT_RATIO_TOLERANCE
  ) {
    advisories.push(
      "Il formato è diverso dal 4:5 consigliato: l’immagine verrà mostrata interamente senza ritagli.",
    );
  }

  return advisories;
}

export function calculateProductThumbnailDimensions({
  width,
  height,
}: ImageDimensions): ImageDimensions {
  const scale = Math.min(
    1,
    PRODUCT_THUMBNAIL_MAX_WIDTH / width,
    PRODUCT_THUMBNAIL_MAX_HEIGHT / height,
  );

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Impossibile elaborare la thumbnail dell’immagine."));
    image.src = url;
  });
}

export async function createProductImageThumbnail({
  sourceUrl,
  width,
  height,
}: {
  sourceUrl: string;
  width: number;
  height: number;
}) {
  const target = calculateProductThumbnailDimensions({ width, height });
  const sourceImage = await loadImage(sourceUrl);
  const canvas = document.createElement("canvas");

  canvas.width = target.width;
  canvas.height = target.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Elaborazione della thumbnail non disponibile.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(sourceImage, 0, 0, target.width, target.height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
          return;
        }

        reject(new Error("Impossibile generare la thumbnail WebP."));
      },
      "image/webp",
      0.82,
    );
  });

  return {
    file: new File([blob], "thumbnail.webp", {
      type: "image/webp",
    }),
    width: target.width,
    height: target.height,
  };
}
