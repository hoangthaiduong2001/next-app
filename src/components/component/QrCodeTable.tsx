"use client";
import { getTableLink } from "@/config/utils";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";

type TQrCodeTable = {
  token: string;
  tableNumber: number;
  width?: number;
};

const QrCodeTable = ({ token, tableNumber }: TQrCodeTable) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    QRCode.toCanvas(
      canvas,
      getTableLink({
        token,
        tableNumber,
      }),
      function (error) {
        if (error) console.log("error qr code", error);
      }
    );
  }, [token, tableNumber]);
  return <canvas ref={canvasRef} width={120} height={120} />;
};

export default QrCodeTable;
