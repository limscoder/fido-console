export const request = async (url: string, payload: any = {}, method = 'POST') => {
  let response
  try {
    response = await fetch(url, {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    return {
      ok: false,
      body: {
        Code: 'RequestError',
        Message: error.toString()
      }
    }
  }

  return {
    ok: response.ok,
    body: await response.json()
  }
}