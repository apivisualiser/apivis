import { getConnection } from '../utility/localdb';
import { getApiInfo, isParameterObject } from './openapidoc';

export interface ApiRequestResponse {
  json?: any;
  text?: string;
  html?: string;
  error?: string;
}

function extractRequestBody(values: Record<string, any>) {
  const body = values.$requestBody;
  return body;
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

    const resp = await fetch(url.toString(), {
      method,
      headers,
      body: bodyIsAllowed && values.$requestBody ? extractRequestBody(values) : undefined,
    });
    const text = await resp.text();

    try {
      const json = JSON.parse(text);
      return { json, text };
    } catch (e) {
      if (text.includes('<html')) {
        return { html: text, text };
      }
      return { text };
    }
  } catch (e: any) {
    return { error: e.message };
  }
}
