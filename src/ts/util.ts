export async function runTests(tests: (() => Promise<any>)[]): Promise<void> {
  for (const test of tests) {
    await test();
  }
}