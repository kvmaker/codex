#!/bin/bash

# 自动化测试运行脚本
# 使用方法: ./run-tests.sh [选项]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 检查依赖是否安装
check_dependencies() {
    print_message $BLUE "🔍 检查依赖..."
    
    if [ ! -d "node_modules" ]; then
        print_message $YELLOW "📦 安装依赖..."
        npm install
    fi
    
    # 检查 Playwright 浏览器
    if [ ! -d "node_modules/@playwright/test" ]; then
        print_message $YELLOW "🌐 安装 Playwright 浏览器..."
        npm run install:browsers
    fi
}

# 启动本地服务器
start_server() {
    print_message $BLUE "🚀 启动本地服务器..."
    
    # 检查端口 8000 是否被占用
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
        print_message $YELLOW "⚠️  端口 8000 已被占用，尝试终止现有进程..."
        pkill -f "python.*http.server.*8000" || true
        sleep 2
    fi
    
    # 启动服务器（后台运行）
    if command -v python3 &> /dev/null; then
        python3 -m http.server 8000 > /dev/null 2>&1 &
    elif command -v python &> /dev/null; then
        python -m http.server 8000 > /dev/null 2>&1 &
    else
        print_message $RED "❌ 未找到 Python，无法启动本地服务器"
        exit 1
    fi
    
    SERVER_PID=$!
    
    # 等待服务器启动
    sleep 3
    
    # 检查服务器是否成功启动
    if curl -s http://localhost:8000 > /dev/null; then
        print_message $GREEN "✅ 服务器已启动 (PID: $SERVER_PID)"
    else
        print_message $RED "❌ 服务器启动失败"
        exit 1
    fi
}

# 停止服务器
stop_server() {
    if [ ! -z "$SERVER_PID" ]; then
        print_message $BLUE "🛑 停止服务器..."
        kill $SERVER_PID 2>/dev/null || true
        pkill -f "python.*http.server.*8000" 2>/dev/null || true
    fi
}

# 运行单元测试
run_unit_tests() {
    print_message $BLUE "🧪 运行单元测试..."
    npm test -- tests/unit --verbose
}

# 运行集成测试
run_integration_tests() {
    print_message $BLUE "🔗 运行集成测试..."
    npm test -- tests/integration --verbose
}

# 运行性能测试
run_performance_tests() {
    print_message $BLUE "⚡ 运行性能测试..."
    npm test -- tests/performance --verbose
}

# 运行安全测试
run_security_tests() {
    print_message $BLUE "🔒 运行安全测试..."
    npm test -- tests/security --verbose
}

# 运行 E2E 测试
run_e2e_tests() {
    print_message $BLUE "🌐 运行端到端测试..."
    npm run test:e2e
}

# 生成测试报告
generate_reports() {
    print_message $BLUE "📊 生成测试报告..."
    
    # 生成覆盖率报告
    npm run test:coverage
    
    print_message $GREEN "✅ 测试报告已生成:"
    print_message $GREEN "   - 覆盖率报告: coverage/lcov-report/index.html"
    print_message $GREEN "   - E2E 测试报告: playwright-report/index.html"
}

# 清理函数
cleanup() {
    print_message $BLUE "🧹 清理资源..."
    stop_server
}

# 设置清理陷阱
trap cleanup EXIT

# 显示帮助信息
show_help() {
    echo "自动化测试运行脚本"
    echo ""
    echo "使用方法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help          显示帮助信息"
    echo "  -u, --unit          只运行单元测试"
    echo "  -i, --integration   只运行集成测试"
    echo "  -p, --performance   只运行性能测试"
    echo "  -s, --security      只运行安全测试"
    echo "  -e, --e2e           只运行端到端测试"
    echo "  -a, --all           运行所有测试（默认）"
    echo "  -r, --report        生成详细报告"
    echo "  --no-server         不启动本地服务器（仅用于单元测试）"
    echo ""
    echo "示例:"
    echo "  $0                  # 运行所有测试"
    echo "  $0 -u               # 只运行单元测试"
    echo "  $0 -e -r            # 运行 E2E 测试并生成报告"
}

# 主函数
main() {
    local run_unit=false
    local run_integration=false
    local run_performance=false
    local run_security=false
    local run_e2e=false
    local run_all=true
    local generate_report=false
    local start_server_flag=true
    
    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -u|--unit)
                run_unit=true
                run_all=false
                start_server_flag=false
                shift
                ;;
            -i|--integration)
                run_integration=true
                run_all=false
                start_server_flag=false
                shift
                ;;
            -p|--performance)
                run_performance=true
                run_all=false
                start_server_flag=false
                shift
                ;;
            -s|--security)
                run_security=true
                run_all=false
                start_server_flag=false
                shift
                ;;
            -e|--e2e)
                run_e2e=true
                run_all=false
                shift
                ;;
            -a|--all)
                run_all=true
                shift
                ;;
            -r|--report)
                generate_report=true
                shift
                ;;
            --no-server)
                start_server_flag=false
                shift
                ;;
            *)
                print_message $RED "❌ 未知选项: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    print_message $GREEN "🎯 开始自动化测试..."
    
    # 检查依赖
    check_dependencies
    
    # 启动服务器（如果需要）
    if [ "$start_server_flag" = true ] && ([ "$run_all" = true ] || [ "$run_e2e" = true ]); then
        start_server
    fi
    
    # 运行测试
    local test_failed=false
    
    if [ "$run_all" = true ]; then
        run_unit_tests || test_failed=true
        run_integration_tests || test_failed=true
        run_performance_tests || test_failed=true
        run_security_tests || test_failed=true
        run_e2e_tests || test_failed=true
    else
        [ "$run_unit" = true ] && (run_unit_tests || test_failed=true)
        [ "$run_integration" = true ] && (run_integration_tests || test_failed=true)
        [ "$run_performance" = true ] && (run_performance_tests || test_failed=true)
        [ "$run_security" = true ] && (run_security_tests || test_failed=true)
        [ "$run_e2e" = true ] && (run_e2e_tests || test_failed=true)
    fi
    
    # 生成报告
    if [ "$generate_report" = true ]; then
        generate_reports
    fi
    
    # 显示结果
    if [ "$test_failed" = true ]; then
        print_message $RED "❌ 部分测试失败"
        exit 1
    else
        print_message $GREEN "✅ 所有测试通过！"
    fi
}

# 运行主函数
main "$@"