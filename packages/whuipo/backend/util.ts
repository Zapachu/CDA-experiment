export function cbToPromise(func) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            func(...args, (err, value) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(value);
            });
        });
    };
}