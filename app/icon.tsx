import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  const logo = readFileSync(join(process.cwd(), "recursos", "VER2_28ed3f02.jpg"));
  const logoSrc = `data:image/jpeg;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#D00000",
        }}
      >
        <img src={logoSrc} alt="Smart Global Sales" style={{ width: 54, height: 54, objectFit: "contain" }} />
      </div>
    ),
    size,
  );
}
