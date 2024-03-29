import { getConnection } from '../utility/localdb';
import { getApiInfo, isParameterObject } from './openapidoc';

export interface ApiRequestResponse {
  json?: any;
  text?: string;
  html?: string;
  error?: string;
  status?: number;
  statusText?: string;
  contentLength?: number;
  contentType?: string;
  duration?: number;
}

function extractRequestBody(values: Record<string, any>) {
  const body = values.$requestBody;
  return body;
}

function httpStatusCodeToStatusText(code: number) {
  switch (code) {
    case 200:
      return 'OK';
    case 201:
      return 'Created';
    case 202:
      return 'Accepted';
    case 204:
      return 'No Content';
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    case 405:
      return 'Method Not Allowed';
    case 429:
      return 'Too Many Requests';
    case 500:
      return 'Internal Server Error';
    case 502:
      return 'Bad Gateway';
    case 503:
      return 'Service Unavailable';
    case 504:
      return 'Gateway Timeout';
    default:
      return 'Unknown';
  }
}

export async function sendApiRequest(
  conid: string,
  path: string,
  values: Record<string, any>,
  method: string
): Promise<ApiRequestResponse> {
  try {
    const connection = await getConnection(conid);
    const apiInfo = await getApiInfo(conid);
    const params = new URLSearchParams();
    const endpoint = apiInfo?.paths?.[path]?.[method];

    let pathReplaced = path;

    for (const param of endpoint?.parameters ?? []) {
      if (isParameterObject(param)) {
        if (param.in === 'query' && values[param.name]) {
          params.append(param.name, values[param.name]);
        }
        if (param.in === 'path') {
          pathReplaced = pathReplaced.replace(`{${param.name}}`, values[param.name]);
        }
      }
    }

    let url: URL;
    if (path.includes('://')) {
      url = new URL(pathReplaced);
    } else {
      url = new URL(connection?.openApiUrl!);
      url.pathname = pathReplaced;
    }

    url.search = params.toString();

    const bodyIsAllowed = ['post', 'put', 'patch'].includes(method);

    const headers = {
      Accept: 'application/json',
      Origin: '*',
    };
    if (bodyIsAllowed) {
      headers['Content-Type'] = 'application/json';
    }

    const started = new Date().getTime();
    const resp = await fetch(url.toString(), {
      method,
      headers,
      body: bodyIsAllowed && values.$requestBody ? extractRequestBody(values) : undefined,
    });
    const text = await resp.text();
    const ended = new Date().getTime();
    // console.log('RESP0', resp)
    const { status, statusText } = resp;
    const contentLength = resp.headers.get('content-length');
    const contentType = resp.headers.get('content-type');

    const common = {
      status,
      statusText: statusText || httpStatusCodeToStatusText(status),
      contentLength: contentLength ? parseInt(contentLength) : undefined,
      contentType,
      duration: ended - started,
    };

    try {
      const json = JSON.parse(text);
      return { json, text, ...common };
    } catch (e) {
      if (text.includes('<html')) {
        return { html: text, text, ...common };
      }
      return { text, ...common };
    }
  } catch (e: any) {
    return { error: e.message };
  }
}
