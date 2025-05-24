export function fixUrl(uri: string): string {
    if (!uri) return uri;
  
  
    return uri.replace('localhost', '10.0.2.2'); 
  }