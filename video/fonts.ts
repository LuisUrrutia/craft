import { loadFont } from "@remotion/fonts";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { staticFile } from "remotion";

// Same files the site serves from public/fonts. loadFont blocks the render
// until each one is ready, so no frame is captured in a fallback face.
export const fontsReady = Promise.all([
  loadFont({
    family: "Inter",
    url: staticFile("fonts/InterVariable.woff2"),
    weight: "100 900",
  }),
  loadFont({
    family: "Inter",
    url: staticFile("fonts/InterVariable-Italic.woff2"),
    weight: "100 900",
    style: "italic",
  }),
  loadFont({
    family: "Redaction35",
    url: staticFile("fonts/Redaction35-Regular.woff2"),
    weight: "400",
  }),
  loadFont({
    family: "Redaction35",
    url: staticFile("fonts/Redaction35-Bold.woff2"),
    weight: "700",
  }),
  loadFont({
    family: "Redaction50",
    url: staticFile("fonts/Redaction50-Regular.woff2"),
    weight: "400",
  }),
  loadFont({
    family: "Redaction70",
    url: staticFile("fonts/Redaction70-Regular.woff2"),
    weight: "400",
  }),
]);

loadJetBrainsMono("normal", { weights: ["400", "500"], subsets: ["latin"] });
