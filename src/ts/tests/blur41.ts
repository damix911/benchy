import blur from "./common/blur";

export default function blur41(): Promise<string> {
  return blur(1920, 1080, 20);
}