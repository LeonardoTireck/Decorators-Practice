export function autobind(
  _target: (...args: any[]) => any,
  context: ClassMethodDecoratorContext,
) {
  context.addInitializer(function (this: any) {
    if (context.private)
      throw new TypeError("Not supported on private methods.");
    this[context.name] = this[context.name].bind(this);
  });
}
// TS Experimental Decorators Example
// function autobind(
// _target: any,
//   _methodName: string,
//   descriptor: PropertyDescriptor,
// ) {
//   const originalDescriptor = descriptor.value;
//   const adjustedDescriptor: PropertyDescriptor = {
//     configurable: true,
//     get() {
//       return originalDescriptor.bind(this);
//     },
//   };
//   return adjustedDescriptor;
// }
// Valid decorator for validating the input, using TS Experimental Decorators
// commented because i want to try a different approach
//
// function trimValidator(
//   _target: any,
//   _methodName: any,
//   descriptor: PropertyDescriptor,
// ) {
//   const originalMethod = descriptor.value;
//
//   descriptor.value = function (...args: any[]) {
//     const result = originalMethod.apply(this, args);
//     if (
//       !Array.isArray(result) ||
//       typeof result[0] !== "string" ||
//       typeof result[1] !== "string" ||
//       typeof result[2] !== "number"
//     ) {
//       console.warn("Unexpected return format from decorated method.");
//       return;
//     }
//     const [title, description, people] = result;
//
//     if (
//       title.trim().length === 0 ||
//       description.trim().length === 0 ||
//       String(people).trim().length === 0
//     ) {
//       alert("Invalid input.");
//       return;
//     }
//
//     return result;
//   };
//
//   return descriptor;
// }
