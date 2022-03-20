import blur from "./common/blur";

export default function blur21(): Promise<string> {
  return blur(1920, 1080, 10);
}