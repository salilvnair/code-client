export class DynamicCompiler {
  static compile = {
    Run: (dynamicString: string) => {
      return eval(dynamicString);
    }
  };
}
