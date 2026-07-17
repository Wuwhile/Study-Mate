<template>
    <view class="resource-container">
        <view class="category-section">
            <scroll-view class="category-scroll" scroll-x>
                <view
                    v-for="item in categories"
                    :key="item.key"
                    class="category-item"
                    :class="{ active: currentCategory === item.key }"
                    @click="filterByCategory(item.key)"
                >
                    <uni-icons
                        class="category-icon"
                        :type="item.icon"
                        size="22"
                        :color="currentCategory === item.key ? '#ffffff' : '#d4744e'"
                    />
                    <text class="category-text">{{ item.name }}</text>
                </view>
            </scroll-view>
        </view>

        <view class="article-list" v-if="!loading">
            <view v-if="filteredArticles.length === 0" class="empty-state">
                <text class="empty-text">暂无匹配资源</text>
                <text class="empty-desc">切换分类或让 AI 学习助手生成一份新资料</text>
            </view>

            <view
                v-for="article in filteredArticles"
                :key="article.id"
                class="article-card"
                @click="viewArticle(article)"
            >
                <view class="card-header">
                    <view class="article-category" :class="getCategoryClass(article.category)">
                        <text>{{ getCategoryName(article.category) }}</text>
                    </view>
                    <view class="article-meta">
                        <text>{{ article.readCount }} 次使用</text>
                        <text>{{ formatDate(article.publishTime) }}</text>
                    </view>
                </view>

                <view class="card-content">
                    <text class="article-title">{{ article.title }}</text>
                    <text class="article-summary">{{ article.summary }}</text>
                    <view class="article-tags">
                        <text v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</text>
                    </view>
                </view>

                <view class="card-footer">
                    <view>
                        <text class="author-name">{{ article.author }}</text>
                        <text class="author-title">{{ article.authorTitle }}</text>
                    </view>
                    <text class="read-more">查看详情</text>
                </view>
            </view>
        </view>

        <view class="loading-container" v-if="loading">
            <view class="loading-spinner"></view>
            <text class="loading-text">加载资源中...</text>
        </view>

        <view class="article-modal" v-if="showArticle" @click="closeArticle">
            <view class="article-content" @click.stop>
                <view class="article-header">
                    <text class="modal-title">{{ selectedArticle.title }}</text>
                    <view class="close-btn" @click="closeArticle">×</view>
                </view>
                <scroll-view scroll-y class="article-body">
                    <view class="article-tags modal-tags">
                        <text v-for="tag in selectedArticle.tags" :key="tag" class="tag">{{ tag }}</text>
                    </view>
                    <text class="content-text">{{ selectedArticle.content }}</text>
                </scroll-view>
                <button class="close-button" @click="closeArticle">关闭</button>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            currentCategory: "all",
            showArticle: false,
            selectedArticle: {},
            categories: [
                { key: "all", name: "全部", icon: "list" },
                { key: "concept", name: "知识讲义", icon: "paperclip" },
                { key: "practice", name: "练习生成", icon: "compose" },
                { key: "review", name: "复习计划", icon: "calendar" },
                { key: "project", name: "项目任务", icon: "folder-add" },
                { key: "exam", name: "考前冲刺", icon: "flag-filled" },
            ],
            articles: [
                {
                    id: 1,
                    title: "大模型个性化学习资源生成流程",
                    summary: "从学习目标、已有基础、错题样本到资源模板，拆解一套可落地的生成链路。",
                    content: "一套稳定的资源生成流程通常包含五步：\n\n1. 解析学习目标：明确课程、章节、考核方式和期望掌握层级。\n2. 建立学习者画像：记录基础水平、时间预算、偏好资源形式和近期错题。\n3. 选择资源模板：讲义、例题、练习、思维导图、项目任务可以使用不同提示词模板。\n4. 多智能体审核：由诊断智能体提出薄弱点，资源智能体生成内容，评价智能体检查难度和覆盖度。\n5. 反馈迭代：学习者完成练习后，将正确率和耗时写回画像，下一轮资源更贴近当前状态。",
                    category: "concept",
                    author: "资源生成智能体",
                    authorTitle: "个性化内容编排",
                    publishTime: "2026-07-01",
                    readCount: 1820,
                    tags: ["大模型", "资源生成", "学习画像"],
                },
                {
                    id: 2,
                    title: "Python 基础薄弱点专项练习包",
                    summary: "面向变量、循环、函数和列表推导式的阶梯式题组，适合入门复盘。",
                    content: "练习包建议按三层推进：\n\n基础层：变量赋值、类型转换、条件判断。\n进阶层：循环嵌套、函数参数、列表和字典操作。\n迁移层：读取一组学习数据，完成统计、筛选与结果输出。\n\nAI 助手会根据错题把题目难度调低或调高，并补充对应知识讲解。",
                    category: "practice",
                    author: "练习生成智能体",
                    authorTitle: "题目与解析生成",
                    publishTime: "2026-07-03",
                    readCount: 936,
                    tags: ["Python", "专项练习", "自动解析"],
                },
                {
                    id: 3,
                    title: "7 天机器学习入门复习计划",
                    summary: "覆盖监督学习、模型评估、过拟合处理与小项目实践的短周期计划。",
                    content: "第 1 天：回顾数据集、特征、标签与训练/测试划分。\n第 2 天：线性回归和逻辑回归。\n第 3 天：决策树、随机森林与特征重要性。\n第 4 天：准确率、召回率、F1 和混淆矩阵。\n第 5 天：过拟合、正则化与交叉验证。\n第 6 天：完成一个小型分类任务。\n第 7 天：复盘错题，生成下一阶段计划。",
                    category: "review",
                    author: "计划智能体",
                    authorTitle: "阶段学习规划",
                    publishTime: "2026-07-05",
                    readCount: 1278,
                    tags: ["机器学习", "复习计划", "项目实践"],
                },
                {
                    id: 4,
                    title: "多智能体学习系统课程项目任务书",
                    summary: "用诊断、资源、答疑、评价四类智能体完成一个闭环学习系统原型。",
                    content: "项目目标：构建一个支持学习画像、资源生成、对话答疑和结果评价的系统。\n\n核心模块：\n- 诊断智能体：根据问卷和错题生成薄弱点列表。\n- 资源智能体：生成讲义、题目和复习卡片。\n- 答疑智能体：围绕用户提问给出分层解释。\n- 评价智能体：检查内容准确性、难度和目标覆盖度。\n\n交付物：前端演示、后端接口、数据库设计、提示词说明和测试记录。",
                    category: "project",
                    author: "项目导师智能体",
                    authorTitle: "任务拆解与验收",
                    publishTime: "2026-07-08",
                    readCount: 754,
                    tags: ["多智能体", "课程设计", "系统开发"],
                },
                {
                    id: 5,
                    title: "考前 48 小时冲刺清单",
                    summary: "压缩复习目标，优先处理高频考点、易错题和可快速提分的知识块。",
                    content: "考前冲刺不适合从头学习。建议按优先级处理：\n\n1. 高频概念：整理定义、公式和适用场景。\n2. 易错题：只看最近三次出错的问题，标记错误原因。\n3. 模板题：总结可复用的解题步骤。\n4. 模拟题：限时完成一套小卷，并让 AI 生成错因报告。\n5. 睡前回顾：只读提纲，不再扩展新内容。",
                    category: "exam",
                    author: "评价智能体",
                    authorTitle: "复盘与提分建议",
                    publishTime: "2026-07-10",
                    readCount: 1456,
                    tags: ["考前冲刺", "错因分析", "提分"],
                },
            ],
        };
    },
    computed: {
        filteredArticles() {
            if (this.currentCategory === "all") return this.articles;
            return this.articles.filter((article) => article.category === this.currentCategory);
        },
    },
    methods: {
        async loadArticles() {
            this.loading = true;
            await new Promise((resolve) => setTimeout(resolve, 300));
            this.loading = false;
        },
        filterByCategory(category) {
            this.currentCategory = category;
        },
        getCategoryName(category) {
            const map = {
                concept: "知识讲义",
                practice: "练习生成",
                review: "复习计划",
                project: "项目任务",
                exam: "考前冲刺",
            };
            return map[category] || "学习资源";
        },
        getCategoryClass(category) {
            return `category-${category}`;
        },
        formatDate(dateStr) {
            return new Date(dateStr).toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
        },
        viewArticle(article) {
            this.selectedArticle = article;
            this.showArticle = true;
        },
        closeArticle() {
            this.showArticle = false;
            this.selectedArticle = {};
        },
    },
    onShow() {
        this.loadArticles();
    },
};
</script>

<style lang="scss">
.resource-container {
    min-height: 100vh;
    background: linear-gradient(180deg, #f7fbff 0%, #eef6f2 58%, #fffaf0 100%);
    padding-bottom: 40rpx;
}

.category-section {
    padding: 24rpx 30rpx 12rpx;
}

.category-scroll {
    white-space: nowrap;
}

.category-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 18rpx 26rpx;
    margin-right: 18rpx;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 18rpx;
    border: 1rpx solid #dfe9f3;
}

.category-item.active {
    background: #16324f;
    border-color: #16324f;

    .category-text {
        color: #fff;
    }
}

.category-icon {
    margin-bottom: 8rpx;
}

.category-text {
    font-size: 22rpx;
    color: #16324f;
    font-weight: 700;
}

.article-list {
    padding: 0 30rpx;
}

.article-card {
    background: rgba(255, 255, 255, 0.96);
    border-radius: 18rpx;
    padding: 28rpx;
    margin-bottom: 22rpx;
    box-shadow: 0 10rpx 24rpx rgba(31, 55, 83, 0.1);
}

.card-header,
.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.article-category {
    padding: 7rpx 16rpx;
    border-radius: 12rpx;
    font-size: 20rpx;
    font-weight: 700;
    color: #16324f;
    background: #eaf4ff;
}

.category-practice { background: #e8f8ef; color: #0f7b51; }
.category-review { background: #fff4d8; color: #946200; }
.category-project { background: #f0eafe; color: #6842a2; }
.category-exam { background: #ffecea; color: #a7352a; }

.article-meta {
    display: flex;
    flex-direction: column;
    text-align: right;
    font-size: 20rpx;
    color: #8a9aab;
}

.card-content {
    padding: 22rpx 0;
}

.article-title {
    display: block;
    font-size: 31rpx;
    font-weight: 800;
    color: #172b4d;
    margin-bottom: 12rpx;
}

.article-summary {
    display: block;
    font-size: 24rpx;
    color: #536578;
    line-height: 1.6;
}

.article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    margin-top: 16rpx;
}

.tag {
    font-size: 19rpx;
    color: #2f80ed;
    background: #edf5ff;
    padding: 5rpx 12rpx;
    border-radius: 12rpx;
}

.author-name {
    display: block;
    font-size: 22rpx;
    color: #172b4d;
    font-weight: 700;
}

.author-title,
.read-more {
    font-size: 20rpx;
    color: #60758a;
}

.read-more {
    color: #2f80ed;
    font-weight: 700;
}

.empty-state,
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 110rpx 40rpx;
    color: #60758a;
}

.empty-text {
    font-size: 30rpx;
    font-weight: 700;
}

.empty-desc,
.loading-text {
    margin-top: 12rpx;
    font-size: 24rpx;
}

.loading-spinner {
    width: 52rpx;
    height: 52rpx;
    border: 4rpx solid #dbe7f3;
    border-top-color: #2f80ed;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.article-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 40rpx;
}

.article-content {
    width: 100%;
    max-width: 640rpx;
    max-height: 86vh;
    background: #fff;
    border-radius: 20rpx;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.article-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx;
    border-bottom: 1rpx solid #e8eef5;
}

.modal-title {
    flex: 1;
    font-size: 30rpx;
    font-weight: 800;
    color: #172b4d;
}

.close-btn {
    width: 52rpx;
    height: 52rpx;
    border-radius: 50%;
    background: #f1f5f9;
    text-align: center;
    line-height: 52rpx;
    font-size: 36rpx;
    color: #60758a;
}

.article-body {
    padding: 0 32rpx;
    max-height: 62vh;
}

.modal-tags {
    margin-bottom: 18rpx;
}

.content-text {
    display: block;
    font-size: 26rpx;
    color: #172b4d;
    line-height: 1.85;
    white-space: pre-wrap;
}

.close-button {
    margin: 24rpx 32rpx 32rpx;
    background: #2f80ed;
    color: #fff;
    border-radius: 16rpx;
}
</style>
