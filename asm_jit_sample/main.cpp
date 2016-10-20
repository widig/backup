#include <asmjit/asmjit.h>
#include <stdio.h>

using namespace asmjit;

// Signature of the generated function.
typedef int (*Func)(void);

int main(int argc, char* argv[]) {
  JitRuntime rt;                          // Runtime specialized for JIT code execution.

  CodeHolder code;                        // Holds code and relocation information.
  code.init(rt.getCodeInfo());            // Initialize to the same arch as JIT runtime.

  X86Assembler a(&code);                  // Create and attach X86Assembler to `code`.
  a.mov(x86::eax, 1);                     // Move one to 'eax' register.
  a.ret();                                // Return from function.
  // ----> X86Assembler is no longer needed from here and can be destroyed <----

  Func fn;
  Error err = rt.add(&fn, &code);         // Add the code generated to the runtime.
  if (err) return 1;                      // Handle a possible error returned by AsmJit.
  // ----> CodeHolder is no longer needed from here and can be destroyed <----

  int result = fn();                      // Execute the generated code.
  printf("%d\n", result);                 // Print the resulting "1".

  // All classes use RAII, all resources will be released before `main()` returns,
  // the generated function can be, however, released explicitly if you intend to
  // reuse or keep the runtime alive, which you should in a production-ready code.
  rt.release(fn);

  return 0;
}