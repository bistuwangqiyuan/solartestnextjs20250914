#!/usr/bin/env node

/**
 * 本地功能测试脚本
 * 用于在部署前验证主要功能
 */

const http = require('http');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

// 测试用例
const testCases = [
  {
    name: '首页加载测试',
    url: '/',
    expectedStatus: 200,
    checkContent: (body) => body.includes('光伏快速关断器')
  },
  {
    name: '数据大屏页面',
    url: '/dashboard',
    expectedStatus: 200,
    checkContent: (body) => body.includes('数据大屏')
  },
  {
    name: '高压试验页面',
    url: '/experiments/high-voltage',
    expectedStatus: 200,
    checkContent: (body) => body.includes('高压试验')
  },
  {
    name: '泄漏电流页面',
    url: '/experiments/leakage',
    expectedStatus: 200,
    checkContent: (body) => body.includes('泄漏电流')
  },
  {
    name: '正常工况页面',
    url: '/experiments/normal',
    expectedStatus: 200,
    checkContent: (body) => body.includes('正常工况')
  },
  {
    name: '非正常工况页面',
    url: '/experiments/abnormal',
    expectedStatus: 200,
    checkContent: (body) => body.includes('非正常工况')
  },
  {
    name: '实验仿真页面',
    url: '/experiments/simulation',
    expectedStatus: 200,
    checkContent: (body) => body.includes('实验仿真')
  },
  {
    name: '数据管理页面',
    url: '/data',
    expectedStatus: 200,
    checkContent: (body) => body.includes('数据')
  }
];

// HTTP 请求函数
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    }).on('error', reject);
  });
}

// 等待服务器启动
function waitForServer(url, maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const checkServer = () => {
      makeRequest(url)
        .then(() => resolve())
        .catch(() => {
          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error('服务器启动超时'));
          } else {
            setTimeout(checkServer, 1000);
          }
        });
    };
    checkServer();
  });
}

// 运行测试
async function runTests() {
  console.log('🚀 启动本地测试...\n');
  
  // 启动开发服务器
  console.log('📦 启动开发服务器...');
  const serverProcess = exec('npm run dev', { 
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  serverProcess.stdout.on('data', (data) => {
    if (process.env.VERBOSE) {
      console.log(`[Server] ${data}`);
    }
  });
  
  serverProcess.stderr.on('data', (data) => {
    if (process.env.VERBOSE) {
      console.error(`[Server Error] ${data}`);
    }
  });
  
  try {
    // 等待服务器启动
    console.log('⏳ 等待服务器启动...');
    await waitForServer(BASE_URL);
    console.log('✅ 服务器已启动\n');
    
    // 运行测试
    console.log('🧪 开始运行测试...\n');
    let passedTests = 0;
    let failedTests = 0;
    
    for (const test of testCases) {
      process.stdout.write(`测试: ${test.name}... `);
      
      try {
        const { status, body } = await makeRequest(BASE_URL + test.url);
        
        if (status !== test.expectedStatus) {
          console.log(`❌ 失败 (状态码: ${status}, 期望: ${test.expectedStatus})`);
          failedTests++;
          continue;
        }
        
        if (test.checkContent && !test.checkContent(body)) {
          console.log('❌ 失败 (内容检查未通过)');
          failedTests++;
          continue;
        }
        
        console.log('✅ 通过');
        passedTests++;
      } catch (error) {
        console.log(`❌ 失败 (错误: ${error.message})`);
        failedTests++;
      }
    }
    
    // 测试总结
    console.log('\n📊 测试总结:');
    console.log(`总计: ${testCases.length} 个测试`);
    console.log(`通过: ${passedTests} 个`);
    console.log(`失败: ${failedTests} 个`);
    console.log(`成功率: ${((passedTests / testCases.length) * 100).toFixed(2)}%`);
    
    if (failedTests === 0) {
      console.log('\n🎉 所有测试通过！项目可以安全部署。');
    } else {
      console.log('\n⚠️  部分测试失败，请检查后再部署。');
    }
    
  } catch (error) {
    console.error('\n❌ 测试过程中出错:', error.message);
  } finally {
    // 关闭服务器
    console.log('\n🛑 关闭开发服务器...');
    serverProcess.kill();
    process.exit(failedTests > 0 ? 1 : 0);
  }
}

// 运行测试
if (require.main === module) {
  runTests().catch(console.error);
}