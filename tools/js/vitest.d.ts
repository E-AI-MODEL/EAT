declare module "vitest" {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void): void;
  export function expect<T>(value: T): {
    toEqual(expected: T): void;
  };
}

declare module "vitest/config" {
  interface VitestConfig {
    test?: {
      environment?: string;
      include?: string[];
    };
  }

  export function defineConfig(config: VitestConfig): VitestConfig;
}
