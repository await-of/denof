import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { of } from "./mod.ts";
import { ofAny } from "./mod.ts";
import { ofAnyCase } from "./mod.ts";
import { ofCase } from "./mod.ts";
import { ofError } from "./mod.ts";
import { ofIt } from "./mod.ts";
import { ofOutcome } from "./mod.ts";
import { ofResult } from "./mod.ts";
import { ofSync } from "./mod.ts";

const OK = "Oh, Hi Mark!";
const BAD = "Nope";
const DEFAULT = "Neutral";
const MESS = "This is mess";

const PROMISE_OK = () => {
  return new Promise((resolve, _r) => resolve(OK));
};

const PROMISE_BAD = () => {
  return new Promise((_r, reject) => reject(BAD));
};

const PROMISE_TIMED = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(OK), 1000);
  });
};

function FUNCTION_OK(result: any) {
  return result;
}

function FUNCTION_BAD() {
  throw new Error(BAD);
}

async function ASYNC_OK(result: any) {
  return result;
}

async function ASYNC_BAD() {
  throw new Error(BAD);
}

function* GEN_OK(result: any) {
  yield result;
}

function* GEN_BAD() {
  throw new Error(BAD);
}

Deno.test({
  name: "of()",
  fn(): void {
    {
      of(PROMISE_OK()).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
    }
    {
      of(PROMISE_BAD()).then(([result, error]) => {
        assertEquals(result, undefined);
        assertEquals(error!.message, BAD);
      });
    }
  },
});

Deno.test({
  name: "ofAny()",
  fn(): void {
    {
      ofAny(FUNCTION_OK, [OK]).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
      ofAny(FUNCTION_BAD, []).then(([result, error]) => {
        assertEquals(result, undefined);
        assertEquals(error!.message, BAD);
      });
      ofAny(FUNCTION_BAD, [], DEFAULT).then(([result, error]) => {
        assertEquals(result, DEFAULT);
        assertEquals(error!.message, BAD);
      });
    }
    {
      ofAny(PROMISE_OK()).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
      ofAny(PROMISE_BAD(), []).then(([result, error]) => {
        assertEquals(result, undefined);
        assertEquals(error!.message, BAD);
      });
      ofAny(PROMISE_BAD(), [], DEFAULT).then(([result, error]) => {
        assertEquals(result, DEFAULT);
        assertEquals(error!.message, BAD);
      });
    }
    {
      ofAny(ASYNC_OK, [OK]).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
      ofAny(ASYNC_BAD, [OK]).then(([result, error]) => {
        assertEquals(result, undefined);
        assertEquals(error!.message, BAD);
      });
      ofAny(ASYNC_BAD, [OK], DEFAULT).then(([result, error]) => {
        assertEquals(result, DEFAULT);
        assertEquals(error!.message, BAD);
      });
    }
    {
      ofAny(GEN_OK, [OK]).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
      ofAny(GEN_BAD, [OK]).then(([result, error]) => {
        assertEquals(result, undefined);
        assertEquals(error!.message, BAD);
      });
      ofAny(GEN_BAD, [OK], DEFAULT).then(([result, error]) => {
        assertEquals(result, DEFAULT);
        assertEquals(error!.message, BAD);
      });
    }
  },
});

Deno.test({
  name: "ofAnyCase()",
  fn(): void {
    {
      ofAnyCase(FUNCTION_OK, { args: [OK] }).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
      ofAnyCase(FUNCTION_BAD, {}).then(([result, error]) => {
        assertEquals(result, undefined);
        assertEquals(error!.message, BAD);
      });
      ofAnyCase(FUNCTION_BAD, { defaults: DEFAULT }).then(([result, error]) => {
        assertEquals(result, DEFAULT);
        assertEquals(error!.message, BAD);
      });
    }
    {
      ofAnyCase(PROMISE_OK()).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
      ofAnyCase(PROMISE_BAD(), {}).then(([result, error]) => {
        assertEquals(result, undefined);
        assertEquals(error!.message, BAD);
      });
      ofAnyCase(PROMISE_BAD(), { defaults: DEFAULT }).then(
        ([result, error]) => {
          assertEquals(result, DEFAULT);
          assertEquals(error!.message, BAD);
        },
      );
    }
    {
      ofAnyCase(ASYNC_OK, { args: [OK] }).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
      ofAnyCase(ASYNC_BAD, { args: [OK] }).then(([result, error]) => {
        assertEquals(result, undefined);
        assertEquals(error!.message, BAD);
      });
      ofAnyCase(ASYNC_BAD, { args: [OK], defaults: DEFAULT }).then(
        ([result, error]) => {
          assertEquals(result, DEFAULT);
          assertEquals(error!.message, BAD);
        },
      );
    }
    {
      ofAnyCase(GEN_OK, { args: [OK] }).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
      ofAnyCase(GEN_BAD, { args: [OK] }).then(([result, error]) => {
        assertEquals(result, undefined);
        assertEquals(error!.message, BAD);
      });
      ofAnyCase(GEN_BAD, { args: [OK], defaults: DEFAULT }).then(
        ([result, error]) => {
          assertEquals(result, DEFAULT);
          assertEquals(error!.message, BAD);
        },
      );
    }
  },
});

Deno.test({
  name: "ofCase()",
  fn(): void {
    {
      ofCase(PROMISE_OK()).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
    }
    {
      ofCase(PROMISE_OK(), undefined).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
    }
    {
      ofCase(PROMISE_OK(), {}).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
    }
    {
      ofCase(PROMISE_BAD()).then(([result, error]) => {
        assertEquals(result, undefined);
        assertEquals(error!.message, BAD);
      });
    }
    {
      ofCase(PROMISE_BAD(), { defaults: DEFAULT }).then(([result, error]) => {
        assertEquals(result, DEFAULT);
        assertEquals(error!.message, BAD);
      });
    }
    {
      ofCase(PROMISE_BAD(), { error: MESS }).then(([result, error]) => {
        assertEquals(result, undefined);
        assertEquals(error!.message, MESS);
      });
    }
  },
});

Deno.test({
  name: "ofError()",
  fn(): void {
    {
      ofError(PROMISE_OK()).then((result) => {
        assertEquals(result, undefined);
      });
    }
    {
      ofError(PROMISE_OK(), MESS).then((result) => {
        assertEquals(result, undefined);
      });
    }
    {
      ofError(PROMISE_OK(), new Error(MESS)).then((result) => {
        assertEquals(result, undefined);
      });
    }
    {
      ofError(PROMISE_BAD()).then((result) => {
        assertEquals(result!.message, BAD);
      });
    }
    {
      ofError(PROMISE_BAD(), MESS).then((result) => {
        assertEquals(result!.message, MESS);
      });
    }
    {
      ofError(PROMISE_BAD(), new Error(MESS)).then((result) => {
        assertEquals(result!.message, MESS);
      });
    }
  },
});

Deno.test({
  name: "ofIt()",
  fn(): void {
    {
      ofIt(PROMISE_OK()).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
    }
    {
      ofIt(PROMISE_OK(), DEFAULT).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
    }
    {
      ofIt(PROMISE_OK(), DEFAULT, MESS).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
    }
    {
      ofIt(PROMISE_OK(), DEFAULT, new Error(MESS)).then(([result, error]) => {
        assertEquals(result, OK);
        assertEquals(error, undefined);
      });
    }
    {
      ofIt(PROMISE_BAD()).then(([result, error]) => {
        assertEquals(result, undefined);
        assertEquals(error!.message, BAD);
      });
    }
    {
      ofIt(PROMISE_BAD(), DEFAULT).then(([result, error]) => {
        assertEquals(result, DEFAULT);
        assertEquals(error!.message, BAD);
      });
    }
    {
      ofIt(PROMISE_BAD(), DEFAULT, MESS).then(([result, error]) => {
        assertEquals(result, DEFAULT);
        assertEquals(error!.message, MESS);
      });
    }
    {
      ofIt(PROMISE_BAD(), DEFAULT, new Error(MESS)).then(([result, error]) => {
        assertEquals(result, DEFAULT);
        assertEquals(error!.message, MESS);
      });
    }
  },
});

Deno.test({
  name: "ofOutcome()",
  fn(): void {
    {
      ofOutcome(FUNCTION_OK, { args: [OK] }).then((outcome) => {
        assertEquals(outcome, OK);
      });
      ofOutcome(FUNCTION_BAD, {}).then((outcome) => {
        assertEquals((outcome as Error)!.message, BAD);
      });
      ofOutcome(FUNCTION_BAD, { defaults: DEFAULT }).then((outcome) => {
        assertEquals((outcome as Error)!.message, BAD);
      });
    }
    {
      ofOutcome(PROMISE_OK()).then((outcome) => {
        assertEquals(outcome, OK);
      });
      ofOutcome(PROMISE_BAD(), {}).then((outcome) => {
        assertEquals((outcome as Error)!.message, BAD);
      });
      ofOutcome(PROMISE_BAD(), { defaults: DEFAULT }).then((outcome) => {
        assertEquals((outcome as Error)!.message, BAD);
      });
    }
    {
      ofOutcome(ASYNC_OK, { args: [OK] }).then((outcome) => {
        assertEquals(outcome, OK);
      });
      ofOutcome(ASYNC_BAD, { args: [OK] }).then((outcome) => {
        assertEquals((outcome as Error)!.message, BAD);
      });
      ofOutcome(ASYNC_BAD, { args: [OK], defaults: DEFAULT }).then(
        (outcome) => {
          assertEquals((outcome as Error)!.message, BAD);
        },
      );
    }
    {
      ofOutcome(GEN_OK, { args: [OK] }).then((outcome) => {
        assertEquals(outcome, OK);
      });
      ofOutcome(GEN_BAD, { args: [OK] }).then((outcome) => {
        assertEquals((outcome as Error)!.message, BAD);
      });
      ofOutcome(GEN_BAD, { args: [OK], defaults: DEFAULT }).then((outcome) => {
        assertEquals((outcome as Error)!.message, BAD);
      });
    }
  },
});

Deno.test({
  name: "ofResult()",
  fn(): void {
    {
      ofResult(PROMISE_OK()).then((result) => {
        assertEquals(result, OK);
      });
    }
    {
      ofResult(PROMISE_OK(), DEFAULT).then((result) => {
        assertEquals(result, OK);
      });
    }
    {
      ofResult(PROMISE_BAD()).then((result) => {
        assertEquals(result, undefined);
      });
    }
    {
      ofResult(PROMISE_BAD(), DEFAULT).then((result) => {
        assertEquals(result, DEFAULT);
      });
    }
  },
});

Deno.test({
  name: "ofSync()",
  fn(): void {
    {
      const [result, error] = ofSync(FUNCTION_OK, [OK]);
      assertEquals(result, OK);
      assertEquals(error, undefined);
    }
    {
      const [result, error] = ofSync(FUNCTION_BAD, []);
      assertEquals(result, undefined);
      assertEquals(error!.message, `Error: ${BAD}`);
    }
    {
      const [result, error] = ofSync(FUNCTION_BAD, [], DEFAULT);
      assertEquals(result, DEFAULT);
      assertEquals(error!.message, `Error: ${BAD}`);
    }
    {
      const [result, error] = ofSync(FUNCTION_BAD, [], DEFAULT, MESS);
      assertEquals(result, DEFAULT);
      assertEquals(error!.message, MESS);
    }
  },
});
