import test from 'ava';
import Observable from 'zen-observable';
import lib from '..';

const callee = lib(Observable);

test(t => callee().calls().forEach(() => t.fail()).then(() => t.pass()));

test(t => callee(() => {throw 'test';}).calls().forEach(() => t.fail()).then(() => t.pass()));

test(t => {
  const f = callee();
  const p = f.calls(1).forEach(v => t.deepEqual(v, {
    args: ['test'],
    output: undefined
  }));
  t.plan(1);
  f('test');
  return p;
});

test(t => {
  const f = callee();
  const p = [
    f.calls(1).forEach(v => t.deepEqual(v, {
      args: ['test'],
      output: undefined
    })),
    f.calls(1).forEach(v => t.deepEqual(v, {
      args: ['test'],
      output: undefined
    }))
  ];
  t.plan(2);
  f('test');
  return Promise.all(p);
});

test(t => {
  const f = callee();
  const p = f.calls(2)
    .reduce((a, v) => [...a, v], [])
    .forEach(v => t.deepEqual(v, [{
      args: [1],
      output: undefined
    }, {
      args: [2],
      output: undefined
    }]));
  t.plan(1);
  f(1);
  f(2);
  f(3);
  return p;
});

test(t => {
  const f = callee();
  const p = [
    f.calls(1)
      .reduce((a, v) => [...a, v], [])
      .forEach(v => t.deepEqual(v, [{
        args: [1],
        output: undefined
      }])),
    f.calls(2)
      .reduce((a, v) => [...a, v], [])
      .forEach(v => t.deepEqual(v, [{
        args: [1],
        output: undefined
      }, {
        args: [2],
        output: undefined
      }]))
  ];
  t.plan(2);
  f(1);
  f(2);
  f(3);
  return Promise.all(p);
});

test(t => {
  const f = callee();
  const p = f.calls(3)
    .reduce((a, v) => [...a, v], [])
    .forEach(v => t.deepEqual(v, [{
      args: [1],
      output: undefined
    }, {
      args: [2],
      output: undefined
    }, {
      args: [3],
      output: undefined
    }]));
  t.plan(1);
  f(1);
  f(2);
  f(3);
  return p;
});

test(t => {
  const f = callee(() => {throw 'test';});
  const p = f.calls(1).forEach(v => t.deepEqual(v, {
    args: [{}],
    err: 'test'
  }));
  t.plan(2);
  try {
    f({});
  } catch(err) {
    t.is(err, 'test');
  }
  return p;
});
