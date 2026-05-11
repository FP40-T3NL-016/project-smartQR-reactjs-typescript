/// <reference types="vite/client" />

type JsQRResult = {
  data: string;
};

type JsQRFunction = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  options?: { inversionAttempts?: string }
) => JsQRResult | null;

declare function jsQR(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  options?: { inversionAttempts?: string }
): JsQRResult | null;

type BarcodeDetectorCode = {
  rawValue: string;
};

declare class BarcodeDetector {
  constructor(options?: { formats?: string[] });
  detect(source: ImageBitmapSource | HTMLVideoElement | HTMLImageElement): Promise<BarcodeDetectorCode[]>;
}

interface Window {
  jsQR?: JsQRFunction;
  BarcodeDetector?: typeof BarcodeDetector;
}
