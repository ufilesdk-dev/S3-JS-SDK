module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            webpackConfig.module.rules = webpackConfig.module.rules.map(rule => {
                if (rule.oneOf instanceof Array) {
                    rule.oneOf = rule.oneOf.map(oneOfRule => {
                        if (oneOfRule.loader && oneOfRule.loader.includes("babel-loader")) {
                            oneOfRule.options.presets = [
                                require.resolve('@babel/preset-env'),
                                require.resolve('@babel/preset-react'),
                            ];
                        }
                        return oneOfRule;
                    });
                }
                return rule;
            });
            return webpackConfig;
        }
    }
};
