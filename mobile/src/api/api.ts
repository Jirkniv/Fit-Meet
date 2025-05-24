import axios  from 'axios';
import Keychain from 'react-native-keychain';
const baseURL = 'http://10.0.2.2:3000';

const api = axios.create({ baseURL });

api.interceptors.request.use(
    async (config: any) => {
    const publicPaths = ['/auth/sign-in', '/auth/register'];
    const url = config.url || '';

    if (publicPaths.some(path => url.includes(path))) {
      return config;
    }

    const credentials = await Keychain.getGenericPassword({ service: 'com.reactexample.token' });
    if (credentials) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${credentials.password}`,
      };
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
