import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { HttpFetchResponse } from '../interfaces/http-fetchResponse.interface';

export class FetchAdapter implements HttpAdapter {
  async get<T>(url: string): Promise<any> {
    try {
      const response: Response = (await fetch(url)) as HttpFetchResponse<T>;

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = (await response.json()) as T;
      return data;
    } catch (error) {
      throw new Error(`This is an error: ${error} - check logs`);
    }
  }
}
