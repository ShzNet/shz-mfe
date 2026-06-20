// Swap this with a real API call later.
// e.g. return fetch(`/api/permissions/${appId}`).then(r => r.ok)
export async function checkPermission(_appId: string): Promise<boolean> {
  await new Promise<void>((resolve) => setTimeout(resolve, 500))
  return true
}
