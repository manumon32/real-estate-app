export const uploadWithQueue = async (
  tasks: (() => Promise<any>)[],
  concurrency = 3,
) => {
  const results: any[] = [];
  let index = 0;

  return new Promise(resolve => {
    const next = async () => {
      if (index >= tasks.length) return;

      const i = index++;
      try {
        results[i] = await tasks[i]();
      } catch (e) {
        results[i] = {error: e};
      }
      await next();
    };

    const runners = Array(Math.min(concurrency, tasks.length))
      .fill(null)
      .map(() => next());

    Promise.all(runners).then(() => resolve(results));
  });
};
