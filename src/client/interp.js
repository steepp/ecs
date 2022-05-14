class AbstractInterpolator {
        constructor() {}
        execute() {
                throw new Error("Must implement!");
        }
}

class LinearInterpolator extends AbstractInterpolator {
        #computeAlpha(t, t0, t1) {
                // TODO: does it belong here?
                const alpha = (t - t0) / (t1 - t0);
                return alpha;
        }

        execute(v0, v1, t) {
                return v0 + (v1 - v0) * t;
        }
}

class HermiteInterpolator extends AbstractInterpolator {
        execute() {
                // https://en.wikipedia.org/wiki/Cubic_Hermite_spline
                // has more arguments
        }
}

export { LinearInterpolator, HermiteInterpolator };
