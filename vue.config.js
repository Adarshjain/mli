const {defineConfig} = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,
    chainWebpack: (config) => {
        config.plugin('define').tap((definitions) => {
            definitions[0]['process.env']['PS_PASS'] = `'${process.env.PS_PASS}'`;
            definitions[0]['process.env']['PS_USERNAME'] = `'${process.env.PS_USERNAME}'`;
            return definitions;
        });
    }
})
