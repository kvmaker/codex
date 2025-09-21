GitHub 的 MCP（Model Context Protocol）已经挂好了，你能直接用一整套 GitHub 操作接口。总结一下功能范围：

### 📂 仓库管理
- **创建仓库**：`github_create_repository`（支持私有、初始化 README）。
- **搜索仓库**：`github_search_repositories`。
- **Fork 仓库**：`github_fork_repository`。
- **创建分支**：`github_create_branch`。
- **获取提交历史**：`github_list_commits`。

### 📄 文件操作
- **新建/更新单个文件**：`github_create_or_update_file`。
- **推送多个文件**：`github_push_files`。
- **获取文件内容**：`github_get_file_contents`。

### 🐛 Issue 管理
- **创建 Issue**：`github_create_issue`。
- **更新 Issue**：`github_update_issue`。
- **列出 Issue**：`github_list_issues`。
- **获取单个 Issue**：`github_get_issue`。
- **评论 Issue**：`github_add_issue_comment`。

### 🔀 Pull Request 管理
- **创建 PR**：`github_create_pull_request`。
- **列出 PR**：`github_list_pull_requests`。
- **获取单个 PR**：`github_get_pull_request`。
- **获取 PR 文件清单**：`github_get_pull_request_files`。
- **获取 PR 状态**（CI 检查结果）：`github_get_pull_request_status`。
- **获取 PR 评论**：`github_get_pull_request_comments`。
- **获取 PR 审查**：`github_get_pull_request_reviews`。
- **创建 PR 审查**：`github_create_pull_request_review`（支持 approve / request changes / comment）。
- **合并 PR**：`github_merge_pull_request`（merge / squash / rebase）。
- **更新 PR 分支**：`github_update_pull_request_branch`。

### 🔎 搜索功能
- **搜索代码**：`github_search_code`。
- **搜索 Issue/PR**：`github_search_issues`。
- **搜索用户**：`github_search_users`。

换句话说，你几乎可以把 GitHub 的日常开发管理（建库、提代码、提 issue、开 PR、审查、合并）都搬到这个 MCP 接口里操作。  