export async function checkPermission(_appId: string): Promise<boolean> {
  await new Promise<void>((resolve) => setTimeout(resolve, 500))
  return true
}
