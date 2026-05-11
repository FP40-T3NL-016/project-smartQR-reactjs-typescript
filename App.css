import { ChangeEvent, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import AnalysisResult from '../../components/AnalysisResult/page';
import { ScanRecord, addRecord, analyzeQRData } from '../../utils/smartQR';

function Scanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const [imageMessage, setImageMessage] = useState('Uploaded image scan result will appear here.');
  const [cameraMessage, setCameraMessage] = useState('Camera scanner result will appear here.');
  const [manualValue, setManualValue] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageRecord, setImageRecord] = useState<ScanRecord | null>(null);
  const [cameraRecord, setCameraRecord] = useState<ScanRecord | null>(null);
  const [manualRecord, setManualRecord] = useState<ScanRecord | null>(null);

  const stopScanner = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => stopScanner();
  }, []);

  const saveDetectedValue = (value: string, source: 'image' | 'camera' | 'manual') => {
    const record = analyzeQRData(value);

    if (!record.value) {
      if (source === 'image') setImageMessage('No QR data found.');
      if (source === 'camera') setCameraMessage('No QR data found.');
      return;
    }

    addRecord(record.value);

    if (source === 'image') {
      setImageRecord(record);
      setImageMessage('');
    } else if (source === 'camera') {
      setCameraRecord(record);
      setCameraMessage('');
    } else {
      setManualRecord(record);
    }
  };

  const scanUploadedImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageMessage('Please select a QR code image first.');
      setImageRecord(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImageMessage('Please upload a valid image file.');
      setImageRecord(null);
      return;
    }

    const imageURL = URL.createObjectURL(file);
    const image = new Image();
    image.onload = async () => {
      setImagePreview(imageURL);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { willReadFrequently: true });

      if (!context) {
        setImageMessage('Canvas is not supported in this browser.');
        return;
      }

      canvas.width = image.naturalWidth || image.width;
      canvas.height = image.naturalHeight || image.height;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      let decodedValue = '';

      try {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
        decodedValue = code?.data || '';
      } catch {
        decodedValue = '';
      }

      if (!decodedValue && window.BarcodeDetector) {
        try {
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const codes = await detector.detect(image);
          decodedValue = codes[0]?.rawValue || '';
        } catch {
          decodedValue = '';
        }
      }

      if (decodedValue) {
        saveDetectedValue(decodedValue, 'image');
      } else {
        setImageRecord(null);
        setImageMessage('No QR data was decoded. Please try a sharper image, crop only the QR area, or use manual input for testing.');
      }
    };

    image.onerror = () => {
      setImageRecord(null);
      setImageMessage('The selected image could not be loaded.');
      URL.revokeObjectURL(imageURL);
    };

    image.src = imageURL;
  };

  const startScanner = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraMessage('Camera access is not supported in this browser.');
      return;
    }

    if (!window.BarcodeDetector) {
      setCameraMessage('Camera can open, but this browser does not support direct QR detection. Please use the Upload QR Image or Manual Input option.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      video.srcObject = stream;
      await video.play();

      const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      setCameraMessage('Camera started. Place a QR code clearly in front of the camera.');
      setCameraRecord(null);

      timerRef.current = window.setInterval(async () => {
        try {
          const codes = await detector.detect(video);
          if (codes.length > 0) {
            saveDetectedValue(codes[0].rawValue, 'camera');
            stopScanner();
          }
        } catch {
          setCameraMessage('Scanning is active. Keep the QR code steady and clearly visible.');
        }
      }, 700);
    } catch {
      setCameraMessage('Camera permission denied or unavailable. Please use the Upload QR Image option.');
    }
  };

  const analyzeManualInput = () => {
    if (!manualValue.trim()) {
      setManualRecord(null);
      return;
    }
    saveDetectedValue(manualValue, 'manual');
  };

  const useDemo = (value: string) => {
    setManualValue(value);
    const record = analyzeQRData(value);
    addRecord(record.value);
    setManualRecord(record);
  };

  return (
    <main className="page">
      <h2>QR Scanner</h2>
      <p>The scanner page supports three ways to read QR data: camera scan, uploaded QR image and manual input. For best testing, upload a clear QR code image or use Chrome/Edge for camera detection.</p>

      <section className="scan-panel">
        <section className="form-container">
          <h3>1. Upload QR Image</h3>
          <p>This is the recommended testing option. Select a clear QR code picture and the page will try to decode it.</p>

          <div className="file-input">
            <label htmlFor="qrImageInput">Choose QR Code Image</label>
            <input id="qrImageInput" type="file" accept="image/*" onChange={scanUploadedImage} />
          </div>

          <div className="preview-box">
            {imagePreview ? <img src={imagePreview} alt="Uploaded QR preview" /> : 'QR image preview will appear here.'}
          </div>
        </section>

        <section className="form-container">
          <h3>2. Camera Scanner</h3>
          <p>Start the camera and hold a QR code clearly in front of it.</p>

          <video ref={videoRef} muted playsInline />

          <div className="actions">
            <button type="button" onClick={startScanner}>Start Camera</button>
            <button className="border-button" type="button" onClick={stopScanner}>Stop Camera</button>
          </div>
        </section>
      </section>

      {imageRecord ? <AnalysisResult record={imageRecord} emptyText="" /> : <div className="result-box">{imageMessage}</div>}
      {cameraRecord ? <AnalysisResult record={cameraRecord} emptyText="" /> : <div className="result-box">{cameraMessage}</div>}

      <section className="form-container">
        <h3>3. Manual QR Data Input</h3>
        <p>Use this option when browser camera or image decoding is not supported.</p>

        <label htmlFor="manualQRData">Manual QR Data</label>
        <textarea id="manualQRData" placeholder="Paste QR data here, for example https://example.com, 03001234567, WIFI:T:WPA;S:CampusNet;P:12345678;;" value={manualValue} onChange={(event) => setManualValue(event.target.value)} />

        <div className="actions">
          <button type="button" onClick={analyzeManualInput}>Analyze Data</button>
          <button className="border-button" type="button" onClick={() => useDemo('https://example.com/login-offer')}>Demo URL</button>
          <button className="border-button" type="button" onClick={() => useDemo('03001234567')}>Demo Phone</button>
          <button className="border-button" type="button" onClick={() => useDemo('WIFI:T:WPA;S:CampusNet;P:12345678;;')}>Demo WiFi</button>
        </div>
      </section>

      <AnalysisResult record={manualRecord} emptyText="Manual analysis result will appear here." />
    </main>
  );
}

export default Scanner;
