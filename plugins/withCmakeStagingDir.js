const { withAppBuildGradle } = require('@expo/config-plugins');

const withCmakeStagingDir = (config) => {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;
    
    // Check if buildStagingDirectory is already configured
    if (!contents.includes('buildStagingDirectory')) {
      // Inject the externalNativeBuild block inside the android { ... } block
      contents = contents.replace(
        /android\s*\{/,
        `android {
    externalNativeBuild {
        cmake {
            buildStagingDirectory = file("C:/tmp/et-cmake")
        }
    }
`
      );
      config.modResults.contents = contents;
    }
    
    return config;
  });
};

module.exports = withCmakeStagingDir;
