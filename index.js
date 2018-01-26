module.exports = Observable => (original = () => {}) => {
  let callbacks = [];

  const f = (...args) => {
    try {
      const output = original(...args);
      callbacks.forEach(cb => cb({args, output}));
      return output;
    } catch(err) {
      callbacks.forEach(cb => cb({args, err}));
      throw err;
    }
  };

  f.calls = f.calls || (
    (max = 0) => new Observable(observer => {
      const check = () => times < max ? true : observer.complete();
      let times = 0;
      const callback = value => {
        observer.next(value);
        ++times;
        check();
      };

      check();

      callbacks = [...callbacks, callback];

      return () => callbacks = callbacks.filter(cb => cb !== callback);
    })
  );

  return f;
};
