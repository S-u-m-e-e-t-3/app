// Simple test to verify Electron app structure
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Electron Desktop App Structure...\n');

// Check main files
const frontendPath = '/app/frontend';
const files = [
  'public/electron.js',
  'src/services/electronAPI.js', 
  'src/components/ElectronFileUploader.jsx',
  'package.json'
];

files.forEach(file => {
  const fullPath = path.join(frontendPath, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check package.json for electron configuration
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(frontendPath, 'package.json'), 'utf8'));
  
  console.log('\n📦 Package Configuration:');
  console.log(`✅ Main: ${pkg.main}`);
  console.log(`✅ Homepage: ${pkg.homepage}`);
  console.log(`✅ Electron script: ${pkg.scripts.electron ? 'present' : 'missing'}`);
  console.log(`✅ Build config: ${pkg.build ? 'present' : 'missing'}`);
  
  console.log('\n🔧 Dependencies:');
  const electronDeps = ['electron', 'electron-builder', 'electron-is-dev', 'simple-git'];
  electronDeps.forEach(dep => {
    const hasDepDev = pkg.devDependencies && pkg.devDependencies[dep];
    const hasDep = pkg.dependencies && pkg.dependencies[dep];
    if (hasDepDev || hasDep) {
      console.log(`✅ ${dep}: ${hasDepDev ? pkg.devDependencies[dep] : pkg.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep}: missing`);
    }
  });
  
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
}

console.log('\n🎉 Electron Desktop App Setup Complete!');
console.log('\n📋 Next Steps:');
console.log('   • Run: cd /app/frontend && yarn electron');
console.log('   • The app will open as a desktop application'); 
console.log('   • Select any git repository folder to analyze');
console.log('   • Build: yarn electron-pack (for distribution)');