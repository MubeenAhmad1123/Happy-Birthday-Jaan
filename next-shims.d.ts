declare module 'next' {
  export type Metadata = any;
  export type Viewport = any;
  export type NextConfig = any;
  const next: any;
  export default next;
}

declare module 'next/types.js' {
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
  const value: any;
  export default value;
}

declare module 'next/server.js' {
  export const NextResponse: any;
  export type NextRequest = any;
}

declare module 'next/navigation' {
  export function notFound(): never;
  export function redirect(url: string): never;
  export function useRouter(): any;
  export function usePathname(): string;
  export function useSearchParams(): any;
}

declare module 'next/headers' {
  export function cookies(): Promise<any>;
  export function headers(): Promise<any>;
}

declare module 'next/server' {
  export class NextRequest {
    cookies: any;
    headers: any;
    json(): Promise<any>;
    nextUrl: any;
    url: string;
    constructor(input: any, init?: any);
  }
  export class NextResponse extends Response {
    static json(body: any, init?: any): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    static next(init?: any): NextResponse;
  }
}

declare module 'next/font/google' {
  export function Dancing_Script(options?: any): { className: string; variable: string };
  export function Caveat(options?: any): { className: string; variable: string };
  export function Baloo_2(options?: any): { className: string; variable: string };
}
