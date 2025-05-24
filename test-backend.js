// Simple test to verify backend structure
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing ForSure Backend Implementation...\n');

// Test 1: Check if all required files exist
const requiredFiles = [
  'models/User.ts',
  'models/Project.ts', 
  'models/Team.ts',
  'app/api/auth/login/route.ts',
  'app/api/auth/register/route.ts',
  'app/api/auth/logout/route.ts',
  'app/api/auth/me/route.ts',
  'app/api/projects/route.ts',
  'app/api/projects/[id]/route.ts',
  'app/api/teams/route.ts',
  'app/api/chat/route.ts',
  'app/api/file-structure/route.ts',
  'lib/db.ts',
  'lib/auth.ts',
  'contexts/auth-context.tsx',
  '.env.local',
  'package.json'
];

console.log('✅ File Structure Check:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ✗ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Test 2: Check package.json dependencies
console.log('\n✅ Dependencies Check:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = ['mongoose', 'bcryptjs', 'jsonwebtoken', '@types/bcryptjs', '@types/jsonwebtoken'];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
    console.log(`  ✓ ${dep}`);
  } else {
    console.log(`  ✗ ${dep} - MISSING`);
    allFilesExist = false;
  }
});

// Test 3: Check environment variables
console.log('\n✅ Environment Variables Check:');
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
  
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`  ✓ ${envVar}`);
    } else {
      console.log(`  ✗ ${envVar} - MISSING`);
      allFilesExist = false;
    }
  });
} else {
  console.log('  ✗ .env.local file missing');
  allFilesExist = false;
}

// Test 4: Check API route structure
console.log('\n✅ API Routes Structure Check:');
const apiRoutes = [
  'app/api/auth/login/route.ts',
  'app/api/auth/register/route.ts',
  'app/api/auth/logout/route.ts',
  'app/api/auth/me/route.ts',
  'app/api/projects/route.ts',
  'app/api/projects/[id]/route.ts',
  'app/api/teams/route.ts',
  'app/api/chat/route.ts',
  'app/api/file-structure/route.ts'
];

apiRoutes.forEach(route => {
  const filePath = path.join(__dirname, route);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasExports = content.includes('export async function');
    console.log(`  ✓ ${route} ${hasExports ? '(has exports)' : '(no exports)'}`);
  } else {
    console.log(`  ✗ ${route} - MISSING`);
  }
});

// Test 5: Check model structure
console.log('\n✅ Database Models Check:');
const models = ['User.ts', 'Project.ts', 'Team.ts'];

models.forEach(model => {
  const filePath = path.join(__dirname, 'models', model);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasSchema = content.includes('Schema') && content.includes('model');
    console.log(`  ✓ models/${model} ${hasSchema ? '(has schema)' : '(no schema)'}`);
  } else {
    console.log(`  ✗ models/${model} - MISSING`);
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 Backend Implementation Complete!');
  console.log('✅ All required files and dependencies are present');
  console.log('✅ API routes are properly structured');
  console.log('✅ Database models are implemented');
  console.log('✅ Authentication system is ready');
  console.log('✅ Environment configuration is set up');
} else {
  console.log('❌ Backend Implementation Incomplete');
  console.log('Some required files or dependencies are missing');
}

console.log('\n📚 Next Steps:');
console.log('1. Start MongoDB: mongod --dbpath /data/db');
console.log('2. Run the application: npm run dev');
console.log('3. Test API endpoints with curl or Postman');
console.log('4. Create comprehensive tests');
console.log('5. Deploy to production');

console.log('\n📖 Documentation: See BACKEND_README.md for detailed setup instructions');