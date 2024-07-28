export const isSameOrigin = (url1: string, url2: string) => {
  try {
    const parsedUrl1 = new URL(url1)
    const parsedUrl2 = new URL(url2)
    console.log("parsedUrl1------")
    console.log(parsedUrl1)
    console.log(parsedUrl2)
    return parsedUrl1.origin === parsedUrl2.origin
  } catch (error) {
    console.error("Invalid URL:", error)
    return false
  }
}
