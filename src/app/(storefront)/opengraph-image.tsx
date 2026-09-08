import { ImageResponse } from "next/og";

import { businessInfo } from "@/config/business";

export const alt = `${businessInfo.brandName}, distillati, vini e rarità`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 76% 30%, #4b321e 0%, #131313 42%, #0e0e0e 100%)",
          color: "#f3f0ea",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid #4d4635",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            padding: "72px",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#e6c45b",
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Selezione italiana
          </div>
          <div
            style={{
              fontFamily: "serif",
              fontSize: 76,
              lineHeight: 1.05,
              marginTop: 24,
              maxWidth: 820,
            }}
          >
            {businessInfo.brandName}
          </div>
          <div
            style={{
              color: "#d0c5af",
              fontSize: 30,
              marginTop: 28,
            }}
          >
            Distillati, vini ed etichette di pregio
          </div>
        </div>
      </div>
    ),
    size,
  );
}
