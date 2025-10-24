const esbuild = require('esbuild');
const path = require('path');

const config = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  platform: 'node',
  target: 'node8',
  format: 'cjs',
  external: ['webos-service'], // WebOS runtime provides this
  minify: true,
  sourcemap: false,
  keepNames: true, // Preserve function names for debugging
  logLevel: 'info',
};

// Build function
async function build() {
  try {
    console.log('Building with esbuild...');
    await esbuild.build(config);
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Run build if this file is executed directly
if (require.main === module) {
  build();
}

module.exports = { config, build };
